import { NextResponse } from "next/server";
import { query } from "@/lib/db";
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
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { message: "Please fill in all required fields (Name, Email, Phone)." },
        { status: 400 }
      );
    }

    // Check duplicate email
    const emailCheck = await query("SELECT id FROM users WHERE email = $1", [email.trim().toLowerCase()]);
    if (emailCheck.rowCount !== null && emailCheck.rowCount > 0) {
      return NextResponse.json(
        { message: "Email is already registered. Please login or use a different email." },
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

      const checkId = await query("SELECT id FROM users WHERE student_id = $1", [studentId]);
      if (checkId.rowCount === 0) {
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
    await query(
      `INSERT INTO users (name, email, password, role, student_id, phone, temp_password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, email.trim().toLowerCase(), hashedPassword, "student", studentId, phone, tempPassword]
    );

    // Send credentials via email
    const emailSent = await sendStudentWelcomeEmail(
      email.trim(),
      name,
      studentId,
      tempPassword
    );

    if (!emailSent) {
      // Log warning but continue, as the user is already stored
      console.warn(`Student account created but welcome email failed to dispatch to: ${email}`);
    }

    return NextResponse.json({
      message: "Student registration successful. Your User ID and temporary password have been sent to your email address.",
      student_id: studentId
    });
  } catch (error) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during student registration. Please try again." },
      { status: 500 }
    );
  }
}
