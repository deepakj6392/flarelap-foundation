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
    const qId = parseInt(id, 10);

    if (isNaN(qId)) {
      return NextResponse.json(
        { message: "Invalid question ID parameter." },
        { status: 400 }
      );
    }

    // Verify question exists
    const check = await prisma.mCQQuestion.findUnique({
      where: { id: qId }
    });

    if (!check) {
      return NextResponse.json(
        { message: "MCQ question not found." },
        { status: 404 }
      );
    }

    // Delete the question
    await prisma.mCQQuestion.delete({
      where: { id: qId }
    });

    return NextResponse.json({
      success: true,
      message: "MCQ question deleted successfully."
    });
  } catch (error: any) {
    console.error("Error deleting MCQ:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete MCQ question." },
      { status: 500 }
    );
  }
}
