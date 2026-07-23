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
        }
      }
    });

    if (courses.length === 0) {
      const defaultCourses = [
        { name: "SSC CGL Mock Test" },
        { name: "GATE Mechanical Engineering Mock Test" },
        { name: "RBI Grade B Mock Test" },
        { name: "CTET Mock Test" },
        { name: "ITI Fitter Semester 1 Mock Test" },
        { name: "ITI Electrician Semester 1 Mock Test" },
        { name: "ITI Electronic Mechanic Semester 1 Mock Test" },
        { name: "RRB JE Civil Engineering Mock Test" },
        { name: "Delhi Judiciary Service Mock Test" },
        { name: "AIIMS Paramedical Entrance Exam Mock Test" },
        { name: "RRB NTPC CBT 1 Mock Test" },
        { name: "SBI PO Mock Test" },
        { name: "NEET UG Complete Practice Mock Test" },
        { name: "NDA General Ability Mock Test" },
        { name: "UPSC Civil Services Prelims GS 1 Mock Test" },
        { name: "UP Police Constable Mock Test" },
        { name: "UP B.Ed Joint Entrance Exam Mock Test" },
      ];

      try {
        await prisma.$executeRawUnsafe('ALTER SEQUENCE courses_id_seq RESTART WITH 1;');
      } catch (seqError) {
        console.error("Warning: Failed to reset courses sequence in API.", seqError);
      }

      await prisma.course.createMany({
        data: defaultCourses,
      });

      // Fetch again after seeding
      courses = await prisma.course.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
        include: {
          testSeries: {
            select: { id: true, isFree: true }
          }
        }
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
