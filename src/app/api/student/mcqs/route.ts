import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

function extractTestNumber(testName: string = "", testId: string = ""): { testNum: number, isChapter: boolean } {
  const combined = (testId + " " + testName).toLowerCase();
  const isChapter = combined.includes("chapter") || combined.includes("practice") || combined.includes("ch-");
  
  const match = combined.match(/(?:mock\s*test|fmt|chapter|practice|test)\s*(\d+)/i);
  if (match) {
    return { testNum: parseInt(match[1], 10), isChapter };
  }
  
  const matches = combined.match(/\d+/g);
  if (matches && matches.length > 0) {
    for (let i = matches.length - 1; i >= 0; i--) {
      const num = parseInt(matches[i], 10);
      if (num < 100) return { testNum: num, isChapter };
    }
  }
  
  return { testNum: 1, isChapter };
}

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

    let testQuestions: any[] = [];

    // Attempt to load the exact test JSON file if course and test identifiers are present
    if (courseRecord && courseRecord.name) {
      const slug = courseRecord.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      const mcqsDataDir = path.resolve(process.cwd(), 'prisma/data/mcqs-data', slug);

      const { testNum, isChapter } = extractTestNumber(testName, testId);
      const clampedNum = Math.min(Math.max(1, testNum), 5);

      const targetFileName = isChapter 
        ? `chapter_test_${clampedNum}.json` 
        : `full_length_mock_test_${clampedNum}.json`;

      const filePath = path.join(mcqsDataDir, targetFileName);
      if (fs.existsSync(filePath)) {
        try {
          const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (fileContent && Array.isArray(fileContent.questions) && fileContent.questions.length > 0) {
            testQuestions = fileContent.questions;
          }
        } catch (e) {
          console.warn("Failed to parse test json file:", filePath, e);
        }
      }
    }

    // Lookup course database MCQs
    let courseMcqs: any[] = [];
    if (targetCourseId) {
      courseMcqs = await prisma.mCQQuestion.findMany({
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
    }

    return NextResponse.json({
      success: true,
      testQuestions,
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
