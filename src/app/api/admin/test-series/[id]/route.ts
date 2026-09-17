import { NextResponse } from "next/server";
import { prisma, resetPrismaClient } from "@/lib/prisma";
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
    const testId = parseInt(id, 10);
    if (isNaN(testId)) {
      return NextResponse.json({ message: "Invalid test ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, type, qs, marks, duration, correctMarks, negativeMarks, isFree, active, courseId } = body;

    let client = prisma;
    let existingTest;
    try {
      existingTest = await client.testSeries.findUnique({
        where: { id: testId }
      });
    } catch (err: any) {
      if (err?.message?.includes("correctMarks") || err?.message?.includes("Unknown argument")) {
        client = resetPrismaClient();
        existingTest = await client.testSeries.findUnique({
          where: { id: testId }
        });
      } else {
        throw err;
      }
    }

    if (!existingTest) {
      return NextResponse.json({ message: "Test series not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (type !== undefined) updateData.type = type.trim();
    if (qs !== undefined) updateData.qs = parseInt(qs, 10);
    if (marks !== undefined) updateData.marks = parseInt(marks, 10);
    if (duration !== undefined) updateData.duration = parseInt(duration, 10);
    if (correctMarks !== undefined) updateData.correctMarks = parseFloat(String(correctMarks));
    if (negativeMarks !== undefined) updateData.negativeMarks = parseFloat(String(negativeMarks));
    if (isFree !== undefined) updateData.isFree = !!isFree;
    if (active !== undefined) updateData.active = !!active;
    if (courseId !== undefined) {
      const numericCourseId = parseInt(courseId, 10);
      if (!isNaN(numericCourseId)) {
        updateData.courseId = numericCourseId;
      }
    }

    let updatedTest;
    try {
      updatedTest = await client.testSeries.update({
        where: { id: testId },
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
        }
      });
    } catch (err: any) {
      if (err?.message?.includes("correctMarks") || err?.message?.includes("Unknown argument")) {
        client = resetPrismaClient();
        updatedTest = await client.testSeries.update({
          where: { id: testId },
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
          }
        });
      } else {
        throw err;
      }
    }

    if (updatedTest.isFree === false) {
      await client.course.update({
        where: { id: updatedTest.courseId },
        data: { premium: true }
      });
    }

    return NextResponse.json({
      testSeries: updatedTest,
      message: "Test series updated successfully!"
    });
  } catch (error: any) {
    console.error("Admin test series update error:", error);
    return NextResponse.json(
      { message: error?.message || "An error occurred while updating the test series." },
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
    const testId = parseInt(id, 10);
    if (isNaN(testId)) {
      return NextResponse.json({ message: "Invalid test ID" }, { status: 400 });
    }

    const existingTest = await prisma.testSeries.findUnique({
      where: { id: testId }
    });
    if (!existingTest) {
      return NextResponse.json({ message: "Test series not found" }, { status: 404 });
    }

    // Delete associated MCQ questions for this test series
    await prisma.mCQQuestion.deleteMany({
      where: { testSeriesId: testId }
    });

    await prisma.testSeries.delete({
      where: { id: testId }
    });

    return NextResponse.json({
      message: "Test series deleted successfully!"
    });
  } catch (error: any) {
    console.error("Admin test series deletion error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the test series." },
      { status: 500 }
    );
  }
}
