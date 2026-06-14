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
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Verify deletion targets student accounts only
    await query("DELETE FROM users WHERE id = $1 AND role = 'student'", [studentId]);

    return NextResponse.json({ message: "Student account deleted successfully" });
  } catch (error: any) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the student account." },
      { status: 500 }
    );
  }
}
