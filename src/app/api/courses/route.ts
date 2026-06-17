import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let courses = await prisma.course.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });

    if (courses.length === 0) {
      const defaultCourses = [
        { name: "Web Development Basics" },
        { name: "Computer Science" },
        { name: "English Grammar Mastery" },
        { name: "Math & Algebra Essentials" },
        { name: "NEET Exam Preparation" },
        { name: "JEE Physics Practice Prep" },
        { name: "JEE Chemistry Practice Prep" },
        { name: "JEE Mathematics Practice Prep" },
        { name: "NEET Biology Advanced Prep" },
        { name: "NEET Physics Advanced Prep" },
        { name: "NEET Chemistry Advanced Prep" },
      ];

      await prisma.course.createMany({
        data: defaultCourses,
      });

      // Fetch again after seeding
      courses = await prisma.course.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching courses." },
      { status: 500 }
    );
  }
}
