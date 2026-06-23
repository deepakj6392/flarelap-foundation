import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const testSeries = await prisma.testSeries.findMany({
      include: {
        course: {
          select: { name: true }
        }
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ testSeries });
  } catch (error: any) {
    console.error("Admin test series fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching test series." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, type, qs, marks, duration, isFree, courseId } = body;

    if (!name || !type || qs === undefined || marks === undefined || duration === undefined || !courseId) {
      return NextResponse.json(
        { message: "All fields (Name, Type, Questions, Marks, Duration, Course) are required." },
        { status: 400 }
      );
    }

    const numericCourseId = parseInt(courseId, 10);
    if (isNaN(numericCourseId)) {
      return NextResponse.json({ message: "Invalid course selection" }, { status: 400 });
    }

    // Verify course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: numericCourseId }
    });
    if (!courseExists) {
      return NextResponse.json({ message: "Selected course does not exist" }, { status: 404 });
    }

    const newTest = await prisma.testSeries.create({
      data: {
        name: name.trim(),
        type: type.trim(),
        qs: parseInt(qs, 10),
        marks: parseInt(marks, 10),
        duration: parseInt(duration, 10),
        isFree: !!isFree,
        courseId: numericCourseId
      },
      include: {
        course: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      testSeries: newTest,
      message: "Test Series added successfully!",
    });
  } catch (error: any) {
    console.error("Admin test series creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the test series." },
      { status: 500 }
    );
  }
}
