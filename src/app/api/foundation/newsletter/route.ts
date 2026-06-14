import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const checkSub = await query("SELECT * FROM newsletter WHERE email = $1", [email]);
    if (checkSub.rowCount && checkSub.rowCount > 0) {
      return NextResponse.json({ message: "Thank you for subscribing!" });
    }

    await query("INSERT INTO newsletter (email) VALUES ($1)", [email]);

    return NextResponse.json({ message: "Thank you for subscribing!" });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { message: "An error occurred while subscribing." },
      { status: 500 }
    );
  }
}
