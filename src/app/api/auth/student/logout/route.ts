import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
      return NextResponse.json({ message: "Session expired." }, { status: 401 });
    }

    if (!decoded || decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied." }, { status: 403 });
    }

    // Record logout event in database
    try {
      await prisma.studentLog.create({
        data: {
          userId: decoded.id,
          action: "LOGOUT"
        }
      });
      await prisma.userLog.create({
        data: {
          userId: decoded.id,
          userDisplayId: decoded.student_id || `STU-${decoded.id}`,
          userName: decoded.name || "Student",
          email: decoded.email,
          role: "STUDENT",
          action: "LOGOUT"
        }
      });
    } catch (logErr) {
      console.error("Student logout userLog error:", logErr);
    }

    return NextResponse.json({ message: "Logged out successfully." });
  } catch (error: any) {
    console.error("Student logout API error:", error);
    return NextResponse.json(
      { message: "An error occurred during student logout." },
      { status: 500 }
    );
  }
}
