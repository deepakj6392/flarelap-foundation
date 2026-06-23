import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Admin courses fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching courses." },
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
    const { name, premium, price } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Course Name is required." },
        { status: 400 }
      );
    }

    const newCourse = await prisma.course.create({
      data: {
        name: name.trim(),
        premium: premium !== undefined ? premium : false,
        price: price !== undefined && price !== "" ? parseFloat(price) : 299.00,
      },
    });

    return NextResponse.json({
      course: newCourse,
      message: "Course added successfully!",
    });
  } catch (error: any) {
    console.error("Admin course creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the course." },
      { status: 500 }
    );
  }
}
