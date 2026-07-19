import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Admin categories fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching categories." },
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
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "Category Name is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { name: name.trim() }
    });
    if (existing) {
      return NextResponse.json(
        { message: "A category with this name already exists." },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({
      category: newCategory,
      message: "Category added successfully!",
    });
  } catch (error: any) {
    console.error("Admin category creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the category." },
      { status: 500 }
    );
  }
}
