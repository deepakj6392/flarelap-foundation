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
    const donationId = parseInt(id);

    if (isNaN(donationId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await query("DELETE FROM donations WHERE id = $1", [donationId]);

    return NextResponse.json({ message: "Donation record deleted successfully" });
  } catch (error: any) {
    console.error("Delete donation error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the donation record." },
      { status: 500 }
    );
  }
}
