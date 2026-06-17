import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { courseId, questions } = body;

    if (!courseId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields (courseId or questions array)." },
        { status: 400 }
      );
    }

    const cId = parseInt(courseId, 10);
    if (isNaN(cId)) {
      return NextResponse.json(
        { message: "Invalid Course ID." },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: cId }
    });

    if (!course) {
      return NextResponse.json(
        { message: "Selected course does not exist." },
        { status: 404 }
      );
    }

    // Prepare data for batch insert
    const dataToInsert = questions.map((q: any) => {
      const questionText = q.question?.trim();
      const optionsArray = Array.isArray(q.options) 
        ? q.options.map((opt: any) => String(opt).trim()) 
        : [];
      const correctIndex = parseInt(q.answer, 10);
      const hintText = q.hint ? String(q.hint).trim() : "";

      if (!questionText || optionsArray.length < 2 || isNaN(correctIndex)) {
        throw new Error(`Invalid question data found in batch for: "${questionText || 'Unknown'}"`);
      }

      return {
        courseId: cId,
        question: questionText,
        options: optionsArray,
        answer: correctIndex,
        hint: hintText
      };
    });

    // Bulk insert using Prisma's createMany
    const createdCount = await prisma.mCQQuestion.createMany({
      data: dataToInsert
    });

    return NextResponse.json({
      success: true,
      count: createdCount.count,
      message: `Successfully uploaded ${createdCount.count} MCQ questions!`
    });

  } catch (error: any) {
    console.error("Error during bulk MCQ creation:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during bulk MCQ upload." },
      { status: 500 }
    );
  }
}
