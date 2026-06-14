import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await query("SELECT * FROM donations ORDER BY created_at DESC");
    return NextResponse.json({ donations: result.rows });
  } catch (error: any) {
    console.error("Donations fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching donation records." },
      { status: 500 }
    );
  }
}
