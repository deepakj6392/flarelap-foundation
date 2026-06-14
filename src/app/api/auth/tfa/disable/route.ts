import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
  }

  try {
    // Disable TFA in users table
    await query(
      "UPDATE users SET tfa_enabled = FALSE, tfa_code = NULL, tfa_expires_at = NULL WHERE id = $1",
      [admin.id]
    );

    return NextResponse.json({
      success: true,
      message: "Two-Factor Authentication (TFA) has been disabled on your account.",
    });
  } catch (error: any) {
    console.error("TFA Disable error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
