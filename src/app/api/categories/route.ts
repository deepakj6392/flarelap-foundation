import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("Public categories fetching error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories." },
      { status: 500 }
    );
  }
}
