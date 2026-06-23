import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

function getStudentIdPrefix(name: string): string {
  const clean = name
    .trim()
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
  const base = clean.substring(0, 5);
  return base.padEnd(5, "x");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loginId } = body;

    if (!loginId) {
      return NextResponse.json(
        { success: false, message: "Email or Mobile Number is required." },
        { status: 400 }
      );
    }

    const cleanLoginId = loginId.trim().toLowerCase();
    const isEmail = cleanLoginId.includes("@");

    // Try finding existing student
    let user = await prisma.user.findFirst({
      where: {
        role: "student",
        OR: [
          { email: isEmail ? cleanLoginId : "" },
          { phone: !isEmail ? cleanLoginId : "" }
        ]
      }
    });

    // If student doesn't exist, auto-create account (like testbook.com's frictionless flow)
    if (!user) {
      const defaultCourse = await prisma.course.findFirst({
        where: { active: true },
        orderBy: { id: "asc" }
      });

      if (!defaultCourse) {
        return NextResponse.json(
          { success: false, message: "No active courses available to enroll." },
          { status: 500 }
        );
      }

      const tempName = isEmail 
        ? `Student_${cleanLoginId.split("@")[0]}`
        : `Student_${cleanLoginId.slice(-4)}`;

      // Generate a unique student ID
      const prefix = getStudentIdPrefix(tempName);
      let studentId = "";
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        studentId = `${prefix}${randomNum}`;
        const checkId = await prisma.user.findUnique({ where: { studentId } });
        if (!checkId) isUnique = true;
        attempts++;
      }
      if (!isUnique) {
        studentId = `${prefix}${Date.now().toString().slice(-4)}`;
      }

      const placeholderPass = bcrypt.hashSync("student123", 10);

      user = await prisma.user.create({
        data: {
          name: tempName,
          email: isEmail ? cleanLoginId : `${studentId}@flarelap-student.org`,
          phone: !isEmail ? cleanLoginId : null,
          password: placeholderPass,
          role: "student",
          studentId,
          courseId: defaultCourse.id
        }
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    // Save OTP to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode,
        otpExpiresAt
      }
    });

    // Send email if it is an email login
    if (isEmail && user.email && !user.email.endsWith("@flarelap-student.org")) {
      const emailSent = await sendOtpEmail(user.email, otpCode);
      if (!emailSent) {
        console.warn(`Failed to dispatch OTP email to ${user.email}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully. Check your email or enter the code directly.",
      otp: otpCode // Returned for local testing convenience
    });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while sending OTP." },
      { status: 500 }
    );
  }
}
