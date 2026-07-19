import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loginId, otp } = body;

    if (!loginId || !otp) {
      return NextResponse.json(
        { success: false, message: "Login ID and OTP code are required." },
        { status: 400 }
      );
    }

    const cleanLoginId = loginId.trim().toLowerCase();
    const isEmail = cleanLoginId.includes("@");

    // Retrieve user record
    const user = await prisma.user.findFirst({
      where: {
        role: "student",
        OR: [
          { email: isEmail ? cleanLoginId : "" },
          { phone: !isEmail ? cleanLoginId : "" }
        ]
      },
      include: {
        course: true,
        category: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    // OTP Verification (with default test OTP '000000' bypass)
    const isTestOtp = otp === "000000";
    if (!isTestOtp) {
      if (!user.otpCode || !user.otpExpiresAt) {
        return NextResponse.json(
          { success: false, message: "No OTP request active for this user." },
          { status: 400 }
        );
      }

      if (user.otpCode !== otp.trim()) {
        return NextResponse.json(
          { success: false, message: "Incorrect OTP code. Please try again." },
          { status: 400 }
        );
      }

      const isExpired = new Date() > new Date(user.otpExpiresAt);
      if (isExpired) {
        return NextResponse.json(
          { success: false, message: "OTP has expired. Please request a new one." },
          { status: 400 }
        );
      }
    }

    // Clear OTP fields in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null
      }
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        student_id: user.studentId,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      student_id: user.studentId,
      phone: user.phone,
      created_at: user.createdAt,
      course_id: user.courseId,
      course_name: user.course?.name || "None",
      category_id: user.categoryId,
      category_name: user.category?.name || "None"
    };

    // Log login activity
    await prisma.studentLog.create({
      data: {
        userId: user.id,
        action: "LOGIN"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
      token,
      user: userData
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while verifying OTP." },
      { status: 500 }
    );
  }
}
