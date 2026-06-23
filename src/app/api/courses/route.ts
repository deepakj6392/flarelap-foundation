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
        { name: "SSC CGL Tier 1 Mock Test 2026" },
        { name: "GATE CS & IT Mock Exam" },
        { name: "SEBI Grade A Officer Practice Mock" },
        { name: "CTET Paper 1 Child Pedagogy" },
        { name: "ITI Fitter Theory Semester 1 & 2" },
        { name: "ITI Electrician Basic Theory 2026" },
        { name: "RRB JE Civil Technical CBT" },
        { name: "State Judiciary Mains Mock Law Paper" },
        { name: "Paramedical Nursing Theory Exam" },
        { name: "Electronic Mechanic Semester 1 Prep" },
        { name: "RRB NTPC CBT 1 Full Mock Test" },
        { name: "SBI PO Prelims Full Mock Test" },
        { name: "NEET Physics Practice Prep" },
        { name: "NDA General Ability Mock Test" },
        { name: "UPSC Prelims GS Paper 1 Mock" },
        { name: "UP Police Constable Practice Sets" },
        { name: "UP B.Ed Joint Entrance Exam Mock" },
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
