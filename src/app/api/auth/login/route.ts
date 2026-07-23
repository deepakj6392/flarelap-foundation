import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { sendTfaOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email, password, otp } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please enter email and password" },
        { status: 400 }
      );
    }

    const result = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.role !== "super_admin") {
      return NextResponse.json(
        { message: "Access denied. Only Super Admin can access the dashboard." },
        { status: 403 }
      );
    }

    // Two-Factor Authentication (TFA) Verification Flow
    if (user.tfa_enabled) {
      // Step 1: TFA requested but OTP not provided yet
      if (!otp) {
        // Generate secure 6-digit login OTP
        const tfaCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiry in 10 minutes
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        // Update database with login TFA code
        await query(
          "UPDATE users SET tfa_code = $1, tfa_expires_at = $2 WHERE id = $3",
          [tfaCode, expiresAt, user.id]
        );

        // Send email
        const emailSent = await sendTfaOtpEmail(user.email, tfaCode, "login");
        if (!emailSent) {
          return NextResponse.json(
            { message: "Failed to dispatch TFA validation email. Check server configuration." },
            { status: 500 }
          );
        }

        return NextResponse.json({
          tfa_required: true,
          email: user.email,
          message: "TFA verification code sent to your email address.",
        });
      }

      // Step 2: TFA OTP provided - verify it
      if (!user.tfa_code || !user.tfa_expires_at) {
        return NextResponse.json(
          { message: "TFA session invalid or expired. Please sign in again." },
          { status: 400 }
        );
      }

      if (user.tfa_code.trim() !== otp.trim()) {
        return NextResponse.json(
          { message: "Invalid TFA verification code." },
          { status: 401 }
        );
      }

      const expiryDate = new Date(user.tfa_expires_at);
      if (expiryDate.getTime() < Date.now()) {
        return NextResponse.json(
          { message: "TFA verification code has expired. Please sign in again." },
          { status: 401 }
        );
      }

      // OTP matches and is unexpired - clear database entries
      await query(
        "UPDATE users SET tfa_code = NULL, tfa_expires_at = NULL WHERE id = $1",
        [user.id]
      );
    }

    // Authentication Success - Generate JWT
    const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "1d" }
    );

    // Record login event in UserLog table
    try {
      await prisma.userLog.create({
        data: {
          userId: user.id,
          userDisplayId: `ADM-${user.id}`,
          userName: user.name || "Super Admin",
          email: user.email,
          role: "ADMIN",
          action: "LOGIN"
        }
      });
    } catch (logErr) {
      console.error("Admin userLog error:", logErr);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: token,
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
