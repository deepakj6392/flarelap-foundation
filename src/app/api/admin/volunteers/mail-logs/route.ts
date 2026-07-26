import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mailLogs = await prisma.volunteerMailLog.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ mailLogs });
  } catch (error: any) {
    console.error("Fetch mail logs error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch mail logs." },
      { status: 500 }
    );
  }
}
