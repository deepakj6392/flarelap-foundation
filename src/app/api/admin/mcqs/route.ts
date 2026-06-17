import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

// GET: Fetch all MCQ questions with course details
export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const mcqs = await prisma.mCQQuestion.findMany({
      include: {
        course: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, mcqs });
  } catch (error: any) {
    console.error("Error fetching MCQs:", error);
    return NextResponse.json(
      { message: "Failed to fetch MCQ questions." },
      { status: 500 }
    );
  }
}

// POST: Create a new MCQ question under a course
export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { courseId, question, options, answer, hint } = body;

    if (!courseId || !question || !options || options.length === 0 || answer === undefined) {
      return NextResponse.json(
        { message: "Missing required fields (Course, Question, Options, and Correct Answer index)." },
        { status: 400 }
      );
    }

    const cId = parseInt(courseId, 10);
    const ansIdx = parseInt(answer, 10);

    if (isNaN(cId) || isNaN(ansIdx)) {
      return NextResponse.json(
        { message: "Invalid Course ID or Answer option selection." },
        { status: 400 }
      );
    }

    // Verify course exists
    const courseCheck = await prisma.course.findUnique({
      where: { id: cId }
    });

    if (!courseCheck) {
      return NextResponse.json(
        { message: "Selected course does not exist." },
        { status: 404 }
      );
    }

    // Create the MCQ question in the DB
    const newMcq = await prisma.mCQQuestion.create({
      data: {
        courseId: cId,
        question: question.trim(),
        options: options.map((opt: string) => opt.trim()),
        answer: ansIdx,
        hint: hint ? hint.trim() : ""
      }
    });

    return NextResponse.json({
      success: true,
      mcq: newMcq,
      message: "MCQ question created successfully!"
    });
  } catch (error: any) {
    console.error("Error creating MCQ:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create MCQ question." },
      { status: 500 }
    );
  }
}
