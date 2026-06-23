import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
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

    const attempts = await prisma.testAttempt.findMany({
      where: { userId: decoded.id },
      include: {
        test: {
          select: { name: true, type: true }
        },
        course: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, attempts });
  } catch (error: any) {
    console.error("Fetch attempts error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching attempts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { testId, courseId, score, totalQs, answered, correct, wrong, duration } = body;

    if (!testId || !courseId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (testId, courseId)." },
        { status: 400 }
      );
    }

    const newAttempt = await prisma.testAttempt.create({
      data: {
        userId: decoded.id,
        courseId: parseInt(courseId, 10),
        testId: parseInt(testId, 10),
        score: parseFloat(score || 0),
        totalQs: parseInt(totalQs || 0, 10),
        answered: parseInt(answered || 0, 10),
        correct: parseInt(correct || 0, 10),
        wrong: parseInt(wrong || 0, 10),
        duration: parseInt(duration || 0, 10)
      }
    });

    return NextResponse.json({
      success: true,
      message: "Test attempt saved successfully.",
      attempt: newAttempt
    });
  } catch (error: any) {
    console.error("Save attempt error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while saving the test attempt." },
      { status: 500 }
    );
  }
}
