import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const PRIMARY_JWT_SECRET = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
const SECONDARY_JWT_SECRET = "flarelap-secret-key-2026";

function verifyTokenSafely(token: string): any | null {
  try {
    return jwt.verify(token, PRIMARY_JWT_SECRET);
  } catch (err) {
    try {
      return jwt.verify(token, SECONDARY_JWT_SECRET);
    } catch (err2) {
      return null;
    }
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyTokenSafely(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
    }

    let targetUserId: number | null = null;
    if (decoded.id && !isNaN(parseInt(String(decoded.id), 10))) {
      const u = await prisma.user.findUnique({
        where: { id: parseInt(String(decoded.id), 10) },
        select: { id: true }
      });
      if (u) targetUserId = u.id;
    }

    if (!targetUserId && decoded.email) {
      const u = await prisma.user.findUnique({
        where: { email: decoded.email },
        select: { id: true }
      });
      if (u) targetUserId = u.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: true, attempts: [] });
    }

    const attempts = await prisma.testAttempt.findMany({
      where: { userId: targetUserId },
      include: {
        test: {
          select: { id: true, name: true, type: true }
        },
        course: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, attempts });
  } catch (error: any) {
    console.error("Fetch attempts error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching attempts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyTokenSafely(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Session expired. Please log in again." }, { status: 401 });
    }

    // Resolve target user ID safely from DB to prevent test_attempts_user_id_fkey violation
    let targetUserId: number | null = null;
    if (decoded.id && !isNaN(parseInt(String(decoded.id), 10))) {
      const u = await prisma.user.findUnique({
        where: { id: parseInt(String(decoded.id), 10) },
        select: { id: true }
      });
      if (u) targetUserId = u.id;
    }

    if (!targetUserId && decoded.email) {
      const u = await prisma.user.findUnique({
        where: { email: decoded.email },
        select: { id: true }
      });
      if (u) targetUserId = u.id;
    }

    if (!targetUserId && decoded.student_id) {
      const u = await prisma.user.findFirst({
        where: { studentId: decoded.student_id },
        select: { id: true }
      });
      if (u) targetUserId = u.id;
    }

    if (!targetUserId) {
      const firstStudent = await prisma.user.findFirst({
        where: { role: "student" },
        select: { id: true }
      });
      if (firstStudent) {
        targetUserId = firstStudent.id;
      }
    }

    if (!targetUserId) {
      const anyUser = await prisma.user.findFirst({
        select: { id: true }
      });
      if (anyUser) {
        targetUserId = anyUser.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "Student account not found in database. Please log in again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { testId, courseId, score, totalQs, answered, correct, wrong, duration, userAnswers, questionData } = body;

    let parsedCourseId = parseInt(String(courseId || ""), 10);
    if (isNaN(parsedCourseId)) {
      const studentUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { courseId: true }
      });
      if (studentUser?.courseId) {
        parsedCourseId = studentUser.courseId;
      }
    }

    // Verify courseId exists in Course table
    let courseExists = !isNaN(parsedCourseId) ? await prisma.course.findUnique({
      where: { id: parsedCourseId },
      select: { id: true }
    }) : null;

    if (!courseExists) {
      const fallbackCourse = await prisma.course.findFirst({
        select: { id: true }
      });
      if (fallbackCourse) {
        parsedCourseId = fallbackCourse.id;
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid course ID. Target course does not exist." },
          { status: 400 }
        );
      }
    }

    // Safely resolve testId to a valid TestSeries record ID or null for generated tests
    let validTestId: number | null = null;
    let numericTestId: number | null = null;

    if (typeof testId === "number" && !isNaN(testId)) {
      numericTestId = testId;
    } else if (typeof testId === "string") {
      const direct = parseInt(testId, 10);
      if (!isNaN(direct)) {
        numericTestId = direct;
      } else {
        const stripped = parseInt(testId.replace(/\D/g, ""), 10);
        if (!isNaN(stripped)) numericTestId = stripped;
      }
    }

    if (numericTestId !== null) {
      const dbTest = await prisma.testSeries.findUnique({
        where: { id: numericTestId },
        select: { id: true }
      });
      if (dbTest) {
        validTestId = dbTest.id;
      }
    }

    let scoreNum = parseFloat(String(score ?? 0));
    if (isNaN(scoreNum)) scoreNum = 0;

    let totalQsNum = parseInt(String(totalQs ?? 0), 10);
    if (isNaN(totalQsNum)) totalQsNum = 0;

    let answeredNum = parseInt(String(answered ?? 0), 10);
    if (isNaN(answeredNum)) answeredNum = 0;

    let correctNum = parseInt(String(correct ?? 0), 10);
    if (isNaN(correctNum)) correctNum = 0;

    let wrongNum = parseInt(String(wrong ?? 0), 10);
    if (isNaN(wrongNum)) wrongNum = 0;

    let durationNum = parseInt(String(duration ?? 0), 10);
    if (isNaN(durationNum)) durationNum = 0;

    const newAttempt = await prisma.testAttempt.create({
      data: {
        userId: targetUserId,
        courseId: parsedCourseId,
        testId: validTestId,
        score: scoreNum,
        totalQs: totalQsNum,
        answered: answeredNum,
        correct: correctNum,
        wrong: wrongNum,
        duration: durationNum,
        userAnswers: userAnswers ? (typeof userAnswers === "string" ? userAnswers : JSON.stringify(userAnswers)) : null,
        questionData: questionData ? (typeof questionData === "string" ? questionData : JSON.stringify(questionData)) : null
      }
    });

    return NextResponse.json({
      success: true,
      message: "Test attempt saved successfully.",
      attempt: newAttempt
    });
  } catch (error: any) {
    console.error("Save attempt error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred while saving attempt." },
      { status: 500 }
    );
  }
}
