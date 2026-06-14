import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { otp } = await request.json();

    if (!otp) {
      return NextResponse.json(
        { success: false, message: "Verification code (OTP) is required." },
        { status: 400 }
      );
    }

    // Fetch TFA details
    const userRes = await query(
      "SELECT id, tfa_code, tfa_expires_at FROM users WHERE id = $1",
      [admin.id]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "User records not found." },
        { status: 404 }
      );
    }

    const user = userRes.rows[0];

    if (!user.tfa_code || !user.tfa_expires_at) {
      return NextResponse.json(
        { success: false, message: "No active TFA enable request found. Please request a new code." },
        { status: 400 }
      );
    }

    // Verify OTP code match
    if (user.tfa_code.trim() !== otp.trim()) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 }
      );
    }

    // Verify expiry
    const expiryDate = new Date(user.tfa_expires_at);
    if (expiryDate.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Enable TFA
    await query(
      "UPDATE users SET tfa_enabled = TRUE, tfa_code = NULL, tfa_expires_at = NULL WHERE id = $1",
      [admin.id]
    );

    return NextResponse.json({
      success: true,
      message: "Two-Factor Authentication (TFA) has been enabled on your account.",
    });
  } catch (error: any) {
    console.error("TFA Enable error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
