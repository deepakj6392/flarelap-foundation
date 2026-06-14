import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, message, post } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    await query(
      "INSERT INTO contacts (name, email, message, post) VALUES ($1, $2, $3, $4)",
      [name, email, message, post || "Foundation Inquiry"]
    );

    return NextResponse.json({ message: "Inquiry submitted successfully." });
  } catch (error: any) {
    console.error("Contacts submission error:", error);
    return NextResponse.json(
      { message: "An error occurred while submitting contact form." },
      { status: 500 }
    );
  }
}
