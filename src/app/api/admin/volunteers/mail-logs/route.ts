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
      try {
        mailLogs = await (db as any).volunteerMailLog.findMany({
          orderBy: { createdAt: "desc" }
        });
      } catch (e) {
        const rawLogs: any = await prisma.$queryRawUnsafe(
          `SELECT id, subject, message, recipients, recipients_count as "recipientsCount", status, created_at as "createdAt" FROM volunteer_mail_logs ORDER BY created_at DESC`
        );
        mailLogs = rawLogs || [];
      }
    } else {
      const rawLogs: any = await prisma.$queryRawUnsafe(
        `SELECT id, subject, message, recipients, recipients_count as "recipientsCount", status, created_at as "createdAt" FROM volunteer_mail_logs ORDER BY created_at DESC`
      );
      mailLogs = rawLogs || [];
    }

    return NextResponse.json({ mailLogs: mailLogs || [] });
  } catch (error: any) {
    console.error("Fetch mail logs error:", error);
    try {
      const rawLogs: any = await prisma.$queryRawUnsafe(
        `SELECT id, subject, message, recipients, recipients_count as "recipientsCount", status, created_at as "createdAt" FROM volunteer_mail_logs ORDER BY created_at DESC`
      );
      return NextResponse.json({ mailLogs: rawLogs || [] });
    } catch (rawErr) {
      return NextResponse.json({ mailLogs: [] });
    }
  }
}
