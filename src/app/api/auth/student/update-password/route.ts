import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json({ message: "Session expired. Please log in again." }, { status: 401 });
    }

    if (!decoded || decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied. Student authorization required." }, { status: 403 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Please fill in all password fields." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Fetch user details from database
    const userRes = await query("SELECT password FROM users WHERE id = $1 AND role = 'student'", [decoded.id]);
    if (userRes.rowCount === 0) {
      return NextResponse.json({ message: "Student account not found." }, { status: 404 });
    }

    const user = userRes.rows[0];

    // Check if current password matches
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Incorrect current password." }, { status: 400 });
    }

    // Hash new password & update
    const hashedNew = bcrypt.hashSync(newPassword, 10);
    await query("UPDATE users SET password = $1 WHERE id = $2", [hashedNew, decoded.id]);

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Student password update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the password." },
      { status: 500 }
    );
  }
}
