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
    const { courseId, questions, isPaid, testSeriesName, testSeriesType } = body;

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

    // Prepare and validate data for batch insert first
    const validQuestionsToInsert: Array<{
      courseId: number;
      question: string;
      options: string[];
      answer: number;
      hint: string;
    }> = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q) continue;

      const questionText = q.question ? String(q.question).trim() : "";
      const optionsArray = Array.isArray(q.options)
        ? q.options.map((opt: any) => String(opt).trim())
        : [];
      const correctIndex = typeof q.answer === "number" ? q.answer : parseInt(String(q.answer), 10);
      const hintText = q.hint ? String(q.hint).trim() : "";

      if (!questionText || optionsArray.length < 2 || isNaN(correctIndex) || correctIndex < 0 || correctIndex >= optionsArray.length) {
        continue;
      }

      validQuestionsToInsert.push({
        courseId: cId,
        question: questionText,
        options: optionsArray,
        answer: correctIndex,
        hint: hintText
      });
    }

    if (validQuestionsToInsert.length === 0) {
      return NextResponse.json(
        { message: "No valid questions found to upload." },
        { status: 400 }
      );
    }

    const isFreeStatus = isPaid !== undefined ? !Boolean(isPaid) : true;

    // Update Course premium status if specified
    if (isPaid !== undefined) {
      await prisma.course.update({
        where: { id: cId },
        data: { premium: Boolean(isPaid) }
      });
    }

    let createdTsId: number | null = null;

    // Auto-create or update TestSeries entry if testSeriesName is provided
    if (testSeriesName && String(testSeriesName).trim()) {
      const tsName = String(testSeriesName).trim();
      const existingTs = await prisma.testSeries.findFirst({
        where: {
          courseId: cId,
          name: tsName,
        },
      });

      if (existingTs) {
        const updatedTs = await prisma.testSeries.update({
          where: { id: existingTs.id },
          data: {
            qs: validQuestionsToInsert.length,
            marks: validQuestionsToInsert.length,
            isFree: isFreeStatus,
          },
        });
        createdTsId = updatedTs.id;
      } else {
        const newTs = await prisma.testSeries.create({
          data: {
            name: tsName,
            type: testSeriesType && String(testSeriesType).trim() ? String(testSeriesType).trim() : "Full Mock",
            qs: validQuestionsToInsert.length,
            marks: validQuestionsToInsert.length,
            duration: 90,
            isFree: isFreeStatus,
            courseId: cId,
          },
        });
        createdTsId = newTs.id;
      }
    }

    const dataToInsert = validQuestionsToInsert.map((q) => ({
      ...q,
      testSeriesId: createdTsId,
    }));

    // Bulk insert using Prisma's createMany (all rows from excel sheet inserted)
    const createdCount = await prisma.mCQQuestion.createMany({
      data: dataToInsert,
    });

    // Ensure all uploaded valid questions for this course are properly linked to createdTsId
    let finalTotalQs = createdCount.count;

    if (createdTsId) {
      const questionTexts = validQuestionsToInsert.map((q) => q.question);
      await prisma.mCQQuestion.updateMany({
        where: {
          courseId: cId,
          question: { in: questionTexts },
        },
        data: {
          testSeriesId: createdTsId,
        },
      });

      const actualLinkedCount = await prisma.mCQQuestion.count({
        where: { testSeriesId: createdTsId },
      });

      finalTotalQs = actualLinkedCount;

      await prisma.testSeries.update({
        where: { id: createdTsId },
        data: {
          qs: actualLinkedCount,
          marks: actualLinkedCount,
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: finalTotalQs,
      message: `Successfully uploaded and linked ${finalTotalQs} MCQ questions!`
    });

  } catch (error: any) {
    console.error("Error during bulk MCQ creation:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during bulk MCQ upload." },
      { status: 500 }
    );
  }
}
