import { NextResponse } from "next/server";
import { prisma, resetPrismaClient } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    let client = prisma;
    let testSeries;
    try {
      testSeries = await client.testSeries.findMany({
        include: {
          course: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { id: "desc" },
      });
    } catch (err: any) {
      if (err?.message?.includes("correctMarks") || err?.message?.includes("Unknown argument")) {
        client = resetPrismaClient();
        testSeries = await client.testSeries.findMany({
          include: {
            course: {
              select: {
                id: true,
                name: true,
                categoryId: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { id: "desc" },
        });
      } else {
        throw err;
      }
    }
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
    const { name, type, qs, marks, duration, correctMarks, negativeMarks, isFree, active, courseId } = body;

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

    let client = prisma;
    let courseExists;
    try {
      courseExists = await client.course.findUnique({
        where: { id: numericCourseId }
      });
    } catch (err: any) {
      if (err?.message?.includes("correctMarks") || err?.message?.includes("Unknown argument")) {
        client = resetPrismaClient();
        courseExists = await client.course.findUnique({
          where: { id: numericCourseId }
        });
      } else {
        throw err;
      }
    }

    if (!courseExists) {
      return NextResponse.json({ message: "Selected course does not exist" }, { status: 404 });
    }

    if (!isFree) {
      await client.course.update({
        where: { id: numericCourseId },
        data: { premium: true }
      });
    }

    const createPayload = {
      name: name.trim(),
      type: type.trim(),
      qs: parseInt(qs, 10),
      marks: parseInt(marks, 10),
      duration: parseInt(duration, 10),
      correctMarks: correctMarks !== undefined ? parseFloat(String(correctMarks)) : 4,
      negativeMarks: negativeMarks !== undefined ? parseFloat(String(negativeMarks)) : 1,
      isFree: !!isFree,
      active: active !== undefined ? !!active : true,
      courseId: numericCourseId
    };

    let newTest;
    try {
      newTest = await client.testSeries.create({
        data: createPayload,
        include: {
          course: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        }
      });
    } catch (err: any) {
      if (err?.message?.includes("correctMarks") || err?.message?.includes("Unknown argument")) {
        client = resetPrismaClient();
        newTest = await client.testSeries.create({
          data: createPayload,
          include: {
            course: {
              select: {
                id: true,
                name: true,
                categoryId: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          }
        });
      } else {
        throw err;
      }
    }

    return NextResponse.json({
      testSeries: newTest,
      message: "Test Series added successfully!",
    });
  } catch (error: any) {
    console.error("Admin test series creation error:", error);
    return NextResponse.json(
      { message: error?.message || "An error occurred while creating the test series." },
      { status: 500 }
    );
  }
}
