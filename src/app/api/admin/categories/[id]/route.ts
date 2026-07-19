import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid Category ID." },
        { status: 400 }
      );
    }

    // Check if there are users registered to this category
    const registeredUsers = await prisma.user.count({
      where: { categoryId },
    });

    if (registeredUsers > 0) {
      return NextResponse.json(
        { message: "Cannot delete this category because it has registered students." },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Category deleted successfully!" });
  } catch (error: any) {
    console.error("Admin category deletion error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the category." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    const body = await request.json();
    const { name } = body;

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid Category ID." },
        { status: 400 }
      );
    }

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "Category Name is required." },
        { status: 400 }
      );
    }

    // Check duplicate name
    const existing = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        NOT: { id: categoryId }
      }
    });
    if (existing) {
      return NextResponse.json(
        { message: "Another category with this name already exists." },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name.trim()
      },
    });

    return NextResponse.json({
      category: updatedCategory,
      message: "Category updated successfully!",
    });
  } catch (error: any) {
    console.error("Admin category update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the category." },
      { status: 500 }
    );
  }
}
