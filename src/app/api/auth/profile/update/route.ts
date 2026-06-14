import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { name, email, password } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and Email are required." },
        { status: 400 }
      );
    }

    const targetEmail = email.toLowerCase().trim();

    // Check if the new email is already taken by a different user
    const checkEmailRes = await query(
      "SELECT id FROM users WHERE email = $1 AND id <> $2",
      [targetEmail, admin.id]
    );
    if (checkEmailRes.rowCount !== null && checkEmailRes.rowCount > 0) {
      return NextResponse.json(
        { success: false, message: "This email address is already in use by another user." },
        { status: 409 }
      );
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      await query(
        "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
        [name, targetEmail, hashedPassword, admin.id]
      );
    } else {
      await query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, targetEmail, admin.id]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: admin.id,
        name,
        email: targetEmail,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred while updating the profile." },
      { status: 500 }
    );
  }
}
