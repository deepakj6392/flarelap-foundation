import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { loginId, password } = await request.json();

    if (!loginId || !password) {
      return NextResponse.json(
        { message: "Please enter your User ID/Email and password." },
        { status: 400 }
      );
    }

    const cleanLoginId = loginId.trim().toLowerCase();

    // Query database for student role matching email or student ID
    const user = await prisma.user.findFirst({
      where: {
        role: "student",
        OR: [
          { email: cleanLoginId },
          { studentId: cleanLoginId }
        ]
      },
      include: {
        course: true,
        category: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials. Student account not found." },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials. Incorrect password." },
        { status: 401 }
      );
    }

    // Generate JWT
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
      { expiresIn: "7d" } // Token expires in 7 days
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

    // Record login event in database
    await prisma.studentLog.create({
      data: {
        userId: user.id,
        action: "LOGIN"
      }
    });

    return NextResponse.json({
      message: "Student logged in successfully.",
      token,
      user: userData
    });
  } catch (error: any) {
    console.error("Student login API error:", error);
    return NextResponse.json(
      { message: "An error occurred during student login. Please try again." },
      { status: 500 }
    );
  }
}
