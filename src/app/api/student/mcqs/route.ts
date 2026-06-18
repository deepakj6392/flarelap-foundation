import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

    // Lookup student's enrolled courseId
    const studentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { courseId: true }
    });

    // Lookup the common course "Reasoning & Aptitude"
    const commonCourse = await prisma.course.findFirst({
      where: { name: "Reasoning & Aptitude" }
    });

    const whereConditions: any[] = [];
    if (studentUser?.courseId) {
      whereConditions.push({ courseId: studentUser.courseId });
    }
    if (commonCourse) {
      whereConditions.push({ courseId: commonCourse.id });
    }

    if (whereConditions.length === 0) {
      return NextResponse.json({ success: true, mcqs: [] });
    }

    // Fetch MCQs linked to either of the course IDs
    const mcqs = await prisma.mCQQuestion.findMany({
      where: {
        OR: whereConditions
      },
      select: {
        id: true,
        question: true,
        options: true,
        answer: true,
        hint: true
      },
      orderBy: { id: "asc" }
    });

    return NextResponse.json({ success: true, mcqs });
  } catch (error: any) {
    console.error("Student MCQs fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching mock questions." },
      { status: 500 }
    );
  }
}
