import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, verification code, and new password are required." },
        { status: 400 }
      );
    }

    // Initialize DB tables if they aren't initialized yet
    await db.initDb();

    // Fetch user and check OTP columns
    const userRes = await db.query(
      "SELECT id, otp_code, otp_expires_at FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "User records not found." },
        { status: 404 }
      );
    }

    const user = userRes.rows[0];

    // Check if OTP was requested
    if (!user.otp_code || !user.otp_expires_at) {
      return NextResponse.json(
        { success: false, message: "No password reset request found for this email." },
        { status: 400 }
      );
    }

    // Verify OTP code match
    if (user.otp_code.trim() !== otp.trim()) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Verify OTP expiration
    const expiryDate = new Date(user.otp_expires_at);
    if (expiryDate.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Validation check on password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Save the new password and clear the OTP fields
    await db.query(
      "UPDATE users SET password = $1, otp_code = NULL, otp_expires_at = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    return NextResponse.json({
      success: true,
      message: "Your password has been changed successfully. You can now log in.",
    });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
