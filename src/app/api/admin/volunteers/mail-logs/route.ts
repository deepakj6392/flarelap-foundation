import { NextResponse } from "next/server";
import { prisma, resetPrismaClient } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let db = prisma;
    if (!(db as any).volunteerMailLog && typeof resetPrismaClient === "function") {
      db = resetPrismaClient();
    }

    let mailLogs: any[] = [];
    if ((db as any).volunteerMailLog) {
      mailLogs = await (db as any).volunteerMailLog.findMany({
        orderBy: { createdAt: "desc" }
      });
    }

    return NextResponse.json({ mailLogs });
  } catch (error: any) {
    console.error("Fetch mail logs error:", error);
    return NextResponse.json({ mailLogs: [], error: error.message });
  }
}
