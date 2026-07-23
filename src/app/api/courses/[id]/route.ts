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

    if (!course) {
      const staticMap: Record<number, string> = {
        9001: "NRA CET 12th Level Mock Test",
        9002: "NRA CET Graduates Mock Test",
        9003: "AIIMS CRE LDC/UDC/Steno/DEO/JAA/SA Mock Test",
        9004: "NBE Junior Assistant 2024 Mock Tests Series",
        9005: "ISRO Assistant Mock Test 2022",
        9006: "ISRO Junior Personal Assistant Mock Test 2022",
        9007: "CCRAS UDC/LDC/Steno/Assistant Mock Test",
        9008: "NBE Junior Assistant Mock Test",
        9009: "CWC (Central Warehousing Corporation) Superintendent Mock Test",
        9010: "FCI Manager Phase I & II Mock Test 2022",
        9011: "FCI Stenographer Mock Test 2022",
        9012: "CSIR Junior Secretariat Assistant (JSA) 2025 Mock Test",
        9013: "CSIR ASO/SO Mock Test 2023",
        9014: "UPSC EPFO Personal Assistant Mock Test",
        9015: "CSIR Junior Stenographer 2025 Mock Test",
        9016: "AAI Junior Executive (Common Cadre) Mock Test",
        9017: "Supreme Court Junior Court Assistant Mock Test",
        9018: "CCRAS MTS 2025 Mock Test Series",
        9019: "CBSE Junior Assistant Mock Test 2025 (Old)",
        9020: "JCI Junior Assistant Mock Test Series",
        9021: "CBSE Assistant/Superintendent & All Other Post(Tier I) Mock Test",
        9022: "NPCIL Stipendiary Trainee (Category II) Prelims 2026 Mock Test",
        9023: "India Post Postman & Mail Guard Mock Test",
        9024: "EPFO Stenographer (Group C) Mock Test 2023",
        9025: "SGPGI Stenographer Mock Test Series 2025",
        9026: "NPCIL Scientific Assistant Physics Mock Test"
      };

      const name = staticMap[courseId] || `Practice Mock Test Series #${courseId}`;
      course = {
        id: courseId,
        name,
        premium: true,
        active: true,
        testSeries: [],
        _count: { mcqs: 0 }
      } as any;
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the course." },
      { status: 500 }
    );
  }
}
