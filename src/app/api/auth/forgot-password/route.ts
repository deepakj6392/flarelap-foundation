import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    // Initialize DB tables if they aren't initialized yet
    await db.initDb();

    // Check if user exists
    const userRes = await db.query(
      "SELECT id, email, role FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Super Admin email address is not registered." },
        { status: 404 }
      );
    }

    const user = userRes.rows[0];

    // Ensure they are a super_admin
    if (user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Password reset only permitted for Super Admin." },
        { status: 403 }
      );
    }

    // Generate a secure 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiration time set to 15 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Save OTP code & expiry in users table
    await db.query(
      "UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE id = $3",
      [otpCode, expiresAt, user.id]
    );

    // Send the email
    const emailSent = await sendOtpEmail(user.email, otpCode);

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Failed to send the verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "A verification code (OTP) has been sent to your email address.",
    });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
