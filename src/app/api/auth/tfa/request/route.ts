import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { sendTfaOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
  }

  try {
    // Generate secure 6-digit OTP
    const tfaCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expires in 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save to users table
    await query(
      "UPDATE users SET tfa_code = $1, tfa_expires_at = $2 WHERE id = $3",
      [tfaCode, expiresAt, admin.id]
    );

    // Send verification email
    const emailSent = await sendTfaOtpEmail(admin.email, tfaCode, "setup");

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Failed to send TFA setup email. Please check your SMTP settings." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A TFA verification code has been dispatched to ${admin.email}.`,
    });
  } catch (error: any) {
    console.error("TFA Request error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
