import { NextResponse } from "next/server";
import { query } from "@/lib/db";
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
    const subscriberId = parseInt(id);

    if (isNaN(subscriberId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await query("DELETE FROM newsletter WHERE id = $1", [subscriberId]);

    return NextResponse.json({ message: "Subscriber removed successfully" });
  } catch (error: any) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json(
      { message: "An error occurred while removing the subscriber." },
      { status: 500 }
    );
  }
}
