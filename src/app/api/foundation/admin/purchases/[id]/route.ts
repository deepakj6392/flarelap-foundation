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
    const purchaseId = parseInt(id, 10);
    if (isNaN(purchaseId)) {
      return NextResponse.json({ message: "Invalid purchase ID" }, { status: 400 });
    }

    await prisma.purchase.delete({
      where: { id: purchaseId }
    });

    return NextResponse.json({ message: "Purchase record deleted successfully" });
  } catch (error: any) {
    console.error("Admin purchase deletion error:", error);
    return NextResponse.json(
      { message: "Failed to delete purchase record" },
      { status: 500 }
    );
  }
}

