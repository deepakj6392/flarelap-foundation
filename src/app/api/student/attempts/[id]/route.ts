import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Session expired." }, { status: 401 });
    }

    if (!decoded || decoded.role !== "student") {
      return NextResponse.json({ success: false, message: "Access denied." }, { status: 403 });
    }

    const { id } = await params;
    const attemptId = parseInt(id, 10);
    if (isNaN(attemptId)) {
      return NextResponse.json({ success: false, message: "Invalid attempt ID." }, { status: 400 });
    }

    const attempt = await prisma.testAttempt.findFirst({
      where: { id: attemptId, userId: decoded.id },
      include: {
        test: {
          select: { name: true, type: true }
        },
        course: {
          select: { name: true }
        }
      }
    });

    if (!attempt) {
      return NextResponse.json({ success: false, message: "Attempt record not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, attempt });
  } catch (error: any) {
    console.error("Fetch attempt by ID error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching test attempt." },
      { status: 500 }
    );
  }
}
