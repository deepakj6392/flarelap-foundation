import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const testSeriesId = searchParams.get("testSeriesId");
    const countOnly = searchParams.get("countOnly");

    // Return count per course if countOnly=true
    if (countOnly === "true") {
      const counts = await prisma.mCQQuestion.groupBy({
        by: ["courseId"],
        _count: { id: true }
      });
      const countMap: Record<string, number> = {};
      counts.forEach((c) => {
        countMap[c.courseId.toString()] = c._count.id;
      });
      return NextResponse.json({ success: true, countMap });
    }

    const where: any = {};
    if (courseId) {
      const cId = parseInt(courseId, 10);
      if (!isNaN(cId)) {
        where.courseId = cId;
      }
    }
    if (testSeriesId) {
      const tsId = parseInt(testSeriesId, 10);
      if (!isNaN(tsId)) {
        where.testSeriesId = tsId;
      }
    }

    const limitParam = searchParams.get("limit");
    const take = limitParam ? parseInt(limitParam, 10) : (courseId || testSeriesId ? undefined : 1000);

    const mcqs = await prisma.mCQQuestion.findMany({
      where,
      take,
      select: {
        id: true,
        courseId: true,
        testSeriesId: true,
        question: true,
        options: true,
        answer: true,
        hint: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            name: true,
            categoryId: true,
            category: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { id: "asc" }
    });
    return NextResponse.json({ success: true, mcqs });
  } catch (error: any) {
    console.error("Error fetching MCQs:", error);
    return NextResponse.json(
      { message: "Failed to fetch MCQ questions." },
      { status: 500 }
    );
  }
}

// POST: Create a new MCQ question under a course / test series
export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { courseId, testSeriesId, question, options, answer, hint } = body;

    if (!courseId || !question || !options || options.length === 0 || answer === undefined) {
      return NextResponse.json(
        { message: "Missing required fields (Course, Question, Options, and Correct Answer index)." },
        { status: 400 }
      );
    }

    const cId = parseInt(courseId, 10);
    const ansIdx = parseInt(answer, 10);
    let tsId: number | null = null;
    if (testSeriesId) {
      const parsedTsId = parseInt(testSeriesId, 10);
      if (!isNaN(parsedTsId)) {
        tsId = parsedTsId;
      }
    }

    if (isNaN(cId) || isNaN(ansIdx)) {
      return NextResponse.json(
        { message: "Invalid Course ID or Answer option selection." },
        { status: 400 }
      );
    }

    // Verify course exists
    const courseCheck = await prisma.course.findUnique({
      where: { id: cId }
    });

    if (!courseCheck) {
      return NextResponse.json(
        { message: "Selected course does not exist." },
        { status: 404 }
      );
    }

    // Create the MCQ question in the DB
    const newMcq = await prisma.mCQQuestion.create({
      data: {
        courseId: cId,
        testSeriesId: tsId,
        question: question.trim(),
        options: options.map((opt: string) => opt.trim()),
        answer: ansIdx,
        hint: hint ? hint.trim() : ""
      }
    });

    // If attached to a test series, update question count (qs)
    if (tsId) {
      const actualCount = await prisma.mCQQuestion.count({
        where: { testSeriesId: tsId }
      });
      await prisma.testSeries.update({
        where: { id: tsId },
        data: { qs: actualCount }
      }).catch(() => { });
    }

    return NextResponse.json({
      success: true,
      mcq: newMcq,
      message: "MCQ question created successfully!"
    });
  } catch (error: any) {
    console.error("Error creating MCQ:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create MCQ question." },
      { status: 500 }
    );
  }
}
