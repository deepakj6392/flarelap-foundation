import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { 
      name, 
      email, 
      phone, 
      amount, 
      paymentMethod, 
      transactionId, 
      message,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature 
    } = await request.json();

    if (!name || !email || !amount || !paymentMethod) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      return NextResponse.json(
        { message: "Donation amount must be a positive number." },
        { status: 400 }
      );
    }

    let finalTransactionId = transactionId || null;

    // Verify signature if using Razorpay
    if (paymentMethod === "Razorpay") {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { message: "Razorpay payment details are missing." },
          { status: 400 }
        );
      }

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

      finalTransactionId = razorpay_payment_id;
    }

    await query(
      `INSERT INTO donations (name, email, phone, amount, payment_method, transaction_id, message) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        name,
        email,
        phone || null,
        donationAmount,
        paymentMethod,
        finalTransactionId,
        message || null
      ]
    );

    return NextResponse.json({ message: "Donation submitted successfully." });
  } catch (error: any) {
    console.error("Donation submission error:", error);
    return NextResponse.json(
      { message: "An error occurred while recording the donation." },
      { status: 500 }
    );
  }
}
