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

    // Verify course exists or create if static
    let course = await prisma.course.findUnique({
      where: { id: numericCourseId }
    });
    if (!course) {
      const staticMap: Record<number, string> = {
        9001: "NRA CET 12th Level Mock Test",
        9002: "NRA CET Graduates Mock Test",
        9003: "AIIMS CRE LDC/UDC/Steno/DEO/JAA/SA Mock Test",
        9004: "NBE Junior Assistant 2024 Mock Tests Series",
        9005: "ISRO Assistant Mock Test 2022",
        9006: "ISRO Junior Personal Assistant Mock Test 2022",
        9007: "CCRAS UDC/LDC/Steno/Assistant Mock Test",
        9008: "NBE Junior Assistant Mock Test",
        9009: "CWC (Central Warehousing Corporation) Superintendent Mock Test",
        9010: "FCI Manager Phase I & II Mock Test 2022",
        9011: "FCI Stenographer Mock Test 2022",
        9012: "CSIR Junior Secretariat Assistant (JSA) 2025 Mock Test",
        9013: "CSIR ASO/SO Mock Test 2023",
        9014: "UPSC EPFO Personal Assistant Mock Test",
        9015: "CSIR Junior Stenographer 2025 Mock Test",
        9016: "AAI Junior Executive (Common Cadre) Mock Test",
        9017: "Supreme Court Junior Court Assistant Mock Test",
        9018: "CCRAS MTS 2025 Mock Test Series",
        9019: "CBSE Junior Assistant Mock Test 2025 (Old)",
        9020: "JCI Junior Assistant Mock Test Series",
        9021: "CBSE Assistant/Superintendent & All Other Post(Tier I) Mock Test",
        9022: "NPCIL Stipendiary Trainee (Category II) Prelims 2026 Mock Test",
        9023: "India Post Postman & Mail Guard Mock Test",
        9024: "EPFO Stenographer (Group C) Mock Test 2023",
        9025: "SGPGI Stenographer Mock Test Series 2025",
        9026: "NPCIL Scientific Assistant Physics Mock Test"
      };

      const name = staticMap[numericCourseId] || `Practice Mock Test Series #${numericCourseId}`;
      try {
        course = await prisma.course.create({
          data: {
            id: numericCourseId,
            name,
            premium: true,
            price: 59.00
          }
        });
      } catch (e) {
        course = await prisma.course.findUnique({
          where: { id: numericCourseId }
        });
      }
    }
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
