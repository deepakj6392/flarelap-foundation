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

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required." }, { status: 400 });
    }

    const numericCourseId = parseInt(courseId, 10);
    if (isNaN(numericCourseId)) {
      return NextResponse.json({ message: "Invalid course selection." }, { status: 400 });
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: numericCourseId }
    });
    if (!course) {
      return NextResponse.json({ message: "Course not found." }, { status: 404 });
    }

    // Verify if already purchased
    const alreadyPurchased = await prisma.purchase.findFirst({
      where: {
        userId: decoded.id,
        courseId: numericCourseId,
        status: "COMPLETED"
      }
    });
    if (alreadyPurchased) {
      return NextResponse.json({ message: "You have already purchased this test series." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_API_KEY;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { message: "Razorpay credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const amountNum = parseFloat(course.price.toString());
    const amountInPaise = Math.round(amountNum * 100);

    const authHeaderRzp = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeaderRzp,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_purchase_${decoded.id}_${numericCourseId}_${Date.now()}`,
      }),
    });

    const data = await rzpResponse.json();

    if (!rzpResponse.ok) {
      console.error("Razorpay order creation for course failed:", data);
      return NextResponse.json(
        { message: data.error?.description || "Failed to create Razorpay order." },
        { status: rzpResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: keyId,
      coursePrice: amountNum
    });
  } catch (error: any) {
    console.error("Error creating student purchase order:", error);
    return NextResponse.json(
      { message: "An error occurred while initiating the payment." },
      { status: 500 }
    );
  }
}
