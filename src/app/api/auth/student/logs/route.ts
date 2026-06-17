import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
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

    // Fetch student logs
    const logs = await prisma.studentLog.findMany({
      where: { userId: decoded.id },
      orderBy: { timestamp: "desc" },
      take: 10
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Student logs fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching student logs." },
      { status: 500 }
    );
  }
}
