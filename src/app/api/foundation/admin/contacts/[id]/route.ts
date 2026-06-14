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
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await query("DELETE FROM contacts WHERE id = $1", [contactId]);

    return NextResponse.json({ message: "Submission deleted successfully" });
  } catch (error: any) {
    console.error("Delete contact error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the contact submission." },
      { status: 500 }
    );
  }
}
