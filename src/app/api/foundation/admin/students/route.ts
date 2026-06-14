import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await query(
      `SELECT id, name, email, phone, student_id, temp_password, created_at 
       FROM users 
       WHERE role = 'student' 
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ students: result.rows });
  } catch (error: any) {
    console.error("Admin student fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching student records." },
      { status: 500 }
    );
  }
}
