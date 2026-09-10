import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { shuffleQuestionOptions } from "@/lib/questionGenerator";


export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json({ message: "Session expired." }, { status: 401 });
    }

    if (!decoded || decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const queryCourseId = searchParams.get("courseId");
    const testId = searchParams.get("testId") || "";
    const testName = searchParams.get("testName") || "";
    let targetCourseId = queryCourseId ? parseInt(queryCourseId, 10) : null;

    if (!targetCourseId) {
      const studentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { courseId: true }
      });
      targetCourseId = studentUser?.courseId ?? null;
    }

    let courseRecord = null;
    if (targetCourseId) {
      courseRecord = await prisma.course.findUnique({
        where: { id: targetCourseId },
        select: { id: true, name: true }
      });
    }

    // Lookup course database MCQs directly
    let courseMcqs: any[] = [];
    if (targetCourseId) {
      const dbMcqs = await prisma.mCQQuestion.findMany({
        where: { courseId: targetCourseId },
        select: {
          id: true,
          question: true,
          options: true,
          answer: true,
          hint: true
        },
        orderBy: { id: "asc" }
      });
      courseMcqs = dbMcqs.map((q: any) => shuffleQuestionOptions(q));
    }

    return NextResponse.json({
      success: true,
      testQuestions: [],
      courseMcqs
    });
  } catch (error: any) {
    console.error("Student MCQs fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching mock questions." },
      { status: 500 }
    );
  }
}
