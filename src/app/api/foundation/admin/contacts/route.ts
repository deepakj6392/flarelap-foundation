import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await query("SELECT * FROM contacts ORDER BY created_at DESC");
    return NextResponse.json({ contacts: result.rows });
  } catch (error: any) {
    console.error("Contacts fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching contact submissions." },
      { status: 500 }
    );
  }
}
