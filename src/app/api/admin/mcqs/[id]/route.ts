import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const qId = parseInt(id, 10);

    if (isNaN(qId)) {
      return NextResponse.json(
        { message: "Invalid question ID parameter." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { question, options, answer, hint, courseId, testSeriesId } = body;

    const existingQ = await prisma.mCQQuestion.findUnique({
      where: { id: qId }
    });

    if (!existingQ) {
      return NextResponse.json(
        { message: "MCQ question not found." },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (question !== undefined) updateData.question = String(question).trim();
    if (options !== undefined && Array.isArray(options)) {
      updateData.options = options.map((opt: any) => String(opt).trim());
    }
    if (answer !== undefined) {
      const ansIdx = parseInt(String(answer), 10);
      if (!isNaN(ansIdx)) {
        updateData.answer = ansIdx;
      }
    }
    if (hint !== undefined) updateData.hint = String(hint).trim();
    if (courseId !== undefined) {
      const cId = parseInt(String(courseId), 10);
      if (!isNaN(cId)) {
        updateData.courseId = cId;
      }
    }
    if (testSeriesId !== undefined) {
      if (testSeriesId === null) {
        updateData.testSeriesId = null;
      } else {
        const tsId = parseInt(String(testSeriesId), 10);
        if (!isNaN(tsId)) updateData.testSeriesId = tsId;
      }
    }

    const updated = await prisma.mCQQuestion.update({
      where: { id: qId },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // If testSeriesId changed, resync counts
    if (existingQ.testSeriesId || updated.testSeriesId) {
      const affectedTsIds = Array.from(new Set([existingQ.testSeriesId, updated.testSeriesId].filter(Boolean))) as number[];
      for (const tsId of affectedTsIds) {
        const actualCount = await prisma.mCQQuestion.count({
          where: { testSeriesId: tsId }
        });
        await prisma.testSeries.update({
          where: { id: tsId },
          data: { qs: actualCount }
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      question: updated,
      message: "MCQ question updated successfully."
    });
  } catch (error: any) {
    console.error("Error updating MCQ:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update MCQ question." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const qId = parseInt(id, 10);

    if (isNaN(qId)) {
      return NextResponse.json(
        { message: "Invalid question ID parameter." },
        { status: 400 }
      );
    }

    // Verify question exists
    const check = await prisma.mCQQuestion.findUnique({
      where: { id: qId }
    });

    if (!check) {
      return NextResponse.json(
        { message: "MCQ question not found." },
        { status: 404 }
      );
    }

    // Delete the question
    await prisma.mCQQuestion.delete({
      where: { id: qId }
    });

    // If belongs to a test series, re-sync count
    if (check.testSeriesId) {
      const actualCount = await prisma.mCQQuestion.count({
        where: { testSeriesId: check.testSeriesId }
      });
      await prisma.testSeries.update({
        where: { id: check.testSeriesId },
        data: { qs: actualCount }
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "MCQ question deleted successfully."
    });
  } catch (error: any) {
    console.error("Error deleting MCQ:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete MCQ question." },
      { status: 500 }
    );
  }
}
