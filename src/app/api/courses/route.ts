import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let courses = await prisma.course.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      include: {
        testSeries: {
          select: { id: true, isFree: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching courses." },
      { status: 500 }
    );
  }
}
