import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
    }

    let course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        testSeries: {
          orderBy: { id: "asc" }
        },
        _count: {
          select: { mcqs: true }
        }
      }
    });

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the course." },
      { status: 500 }
    );
  }
}
