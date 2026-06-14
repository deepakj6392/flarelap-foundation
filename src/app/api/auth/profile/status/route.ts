import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
  }

  try {
    const userRes = await query(
      "SELECT name, email, tfa_enabled FROM users WHERE id = $1",
      [admin.id]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const user = userRes.rows[0];
    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        tfa_enabled: user.tfa_enabled,
      },
    });
  } catch (error: any) {
    console.error("Profile status fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
