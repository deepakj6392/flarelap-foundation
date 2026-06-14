import { NextResponse } from "next/server";
import { query } from "@/lib/db";
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
    const res = await query(
      `SELECT * FROM users 
       WHERE role = 'student' 
         AND (LOWER(email) = $1 OR LOWER(student_id) = $1)`,
      [cleanLoginId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { message: "Invalid credentials. Student account not found." },
        { status: 401 }
      );
    }

    const user = res.rows[0];

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
        student_id: user.student_id,
      },
      jwtSecret,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Remove password from returned object
    const { password: _, ...userData } = user;

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
