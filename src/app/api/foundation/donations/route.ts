import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, phone, amount, paymentMethod, transactionId, message } = await request.json();

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

    await query(
      `INSERT INTO donations (name, email, phone, amount, payment_method, transaction_id, message) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        name,
        email,
        phone || null,
        donationAmount,
        paymentMethod,
        transactionId || null,
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
