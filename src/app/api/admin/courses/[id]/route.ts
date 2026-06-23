import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

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
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: "Invalid Course ID." },
        { status: 400 }
      );
    }

    // Check if there are users registered to this course
    const registeredUsers = await prisma.user.count({
      where: { courseId },
    });

    if (registeredUsers > 0) {
      return NextResponse.json(
        { message: "Cannot delete this course because it has registered students." },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: "Course deleted successfully!" });
  } catch (error: any) {
    console.error("Admin course deletion error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the course." },
      { status: 500 }
    );
  }
}

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
    const courseId = parseInt(id, 10);
    const body = await request.json();
    const { name, active, premium, price } = body;

    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: "Invalid Course ID." },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(active !== undefined && { active }),
        ...(premium !== undefined && { premium }),
        ...(price !== undefined && { price: parseFloat(price) }),
      },
    });

    return NextResponse.json({
      course: updatedCourse,
      message: "Course updated successfully!",
    });
  } catch (error: any) {
    console.error("Admin course update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the course." },
      { status: 500 }
    );
  }
}
