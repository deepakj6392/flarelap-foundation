import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

    const purchases = await prisma.purchase.findMany({
      where: { userId: decoded.id, status: "COMPLETED" },
      include: {
        course: {
          select: { name: true, premium: true, categoryId: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ purchases });
  } catch (error: any) {
    console.error("Student purchases fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching purchases." },
      { status: 500 }
    );
  }
}

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
    const { 
      courseId, 
      amount, 
      paymentMethod, 
      transactionId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature 
    } = body;

    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required." }, { status: 400 });
    }

    const numericCourseId = parseInt(courseId, 10);
    if (isNaN(numericCourseId)) {
      return NextResponse.json({ message: "Invalid course selection." }, { status: 400 });
    }

    // Verify course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: numericCourseId }
    });
    if (!courseExists) {
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

    let finalAmount = amount !== undefined ? parseFloat(amount) : parseFloat(courseExists.price.toString());
    let finalMethod = paymentMethod || "Simulated Card";
    let finalTxnId = transactionId || `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Verify signature if using Razorpay details
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const keySecret = process.env.RAZORPAY_SECRET_KEY;
      if (!keySecret) {
        return NextResponse.json(
          { message: "Razorpay key secret is not configured on the server." },
          { status: 500 }
        );
      }

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", keySecret)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        return NextResponse.json(
          { message: "Payment verification failed. Invalid signature." },
          { status: 400 }
        );
      }

      finalAmount = parseFloat(courseExists.price.toString());
      finalMethod = "Razorpay";
      finalTxnId = razorpay_payment_id;
    }

    const newPurchase = await prisma.purchase.create({
      data: {
        userId: decoded.id,
        courseId: numericCourseId,
        amount: finalAmount,
        paymentMethod: finalMethod,
        transactionId: finalTxnId,
        status: "COMPLETED"
      },
      include: {
        course: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      purchase: newPurchase,
      message: "Purchase processed successfully!"
    });
  } catch (error: any) {
    console.error("Student purchase creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing the purchase." },
      { status: 500 }
    );
  }
}
