import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendStudentWelcomeEmail } from "@/lib/mail";

// Generate random temporary password
function generateTempPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// Generate unique student ID based on name starting letters
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
    const { name, email, phone, course } = await request.json();

    if (!name || !email || !phone || !course) {
      return NextResponse.json(
        { message: "Please fill in all required fields (Name, Email, Phone, Course)." },
        { status: 400 }
      );
    }

    // Check duplicate email
    const emailCheck = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
    if (emailCheck) {
      return NextResponse.json(
        { message: "Email is already registered. Please login or use a different email." },
        { status: 400 }
      );
    }

    // Verify course exists
    const courseId = parseInt(course, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { message: "Invalid course selection." },
        { status: 400 }
      );
    }

    const courseCheck = await prisma.course.findUnique({
      where: { id: courseId }
    });
    if (!courseCheck) {
      return NextResponse.json(
        { message: "Selected course does not exist." },
        { status: 400 }
      );
    }

    // Generate unique student ID
    const prefix = getStudentIdPrefix(name);
    let studentId = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      studentId = `${prefix}${randomNum}`;

      const checkId = await prisma.user.findUnique({
        where: { studentId }
      });
      if (!checkId) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      studentId = `${prefix}${Date.now().toString().slice(-4)}`;
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = bcrypt.hashSync(tempPassword, 10);

    // Save student to database
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: "student",
        studentId,
        phone,
        tempPassword,
        courseId: courseId // Save course ID relation
      }
    });

    // Send credentials via email
    const emailSent = await sendStudentWelcomeEmail(
      email.trim(),
      name,
      studentId,
      tempPassword
    );

    if (!emailSent) {
      console.warn(`Student account created but welcome email failed to dispatch to: ${email}`);
    }

    // Import jwt dynamically or rely on package to sign token for instant login
    const jwt = require("jsonwebtoken");
    const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        student_id: newUser.studentId,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      student_id: newUser.studentId,
      phone: newUser.phone,
      created_at: newUser.createdAt,
      course_id: newUser.courseId,
      course_name: courseCheck.name
    };

    // Record login event in database
    await prisma.studentLog.create({
      data: {
        userId: newUser.id,
        action: "LOGIN"
      }
    });

    return NextResponse.json({
      message: "Student registration successful.",
      student_id: studentId,
      temp_password: tempPassword,
      token,
      user: userData
    });
  } catch (error) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during student registration. Please try again." },
      { status: 500 }
    );
  }
}
