import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { message: "Amount is required." },
        { status: 400 }
      );
    }

    const orderAmount = parseFloat(amount);
    if (isNaN(orderAmount) || orderAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_API_KEY;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { message: "Razorpay credentials are not configured on the server." },
        { status: 500 }
      );
    }

    // Razorpay basic auth header
    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: Math.round(orderAmount * 100), // amount in paise
        currency: "INR",
        receipt: `receipt_donate_${Date.now()}`,
      }),
    });

    const data = await rzpResponse.json();

    if (!rzpResponse.ok) {
      console.error("Razorpay order creation failed:", data);
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
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { message: "An error occurred while initiating the payment." },
      { status: 500 }
    );
  }
}
