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
    const testId = parseInt(id, 10);
    if (isNaN(testId)) {
      return NextResponse.json({ message: "Invalid test ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, type, qs, marks, duration, isFree, courseId } = body;

    // Check if test exists
    const existingTest = await prisma.testSeries.findUnique({
      where: { id: testId }
    });
    if (!existingTest) {
      return NextResponse.json({ message: "Test series not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (type !== undefined) updateData.type = type.trim();
    if (qs !== undefined) updateData.qs = parseInt(qs, 10);
    if (marks !== undefined) updateData.marks = parseInt(marks, 10);
    if (duration !== undefined) updateData.duration = parseInt(duration, 10);
    if (isFree !== undefined) updateData.isFree = !!isFree;
    if (courseId !== undefined) {
      const numericCourseId = parseInt(courseId, 10);
      if (!isNaN(numericCourseId)) {
        updateData.courseId = numericCourseId;
      }
    }

    const updatedTest = await prisma.testSeries.update({
      where: { id: testId },
      data: updateData,
      include: {
        course: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      testSeries: updatedTest,
      message: "Test series updated successfully!"
    });
  } catch (error: any) {
    console.error("Admin test series update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the test series." },
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
