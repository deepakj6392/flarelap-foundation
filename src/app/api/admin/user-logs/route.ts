import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const roleFilter = searchParams.get("role") || "ALL";
    const actionFilter = searchParams.get("action") || "ALL";

    // Build Prisma filter clauses
    const where: any = {};

    if (roleFilter !== "ALL") {
      where.role = roleFilter;
    }

    if (actionFilter !== "ALL") {
      where.action = actionFilter;
    }

    if (query) {
      where.OR = [
        { userDisplayId: { contains: query, mode: "insensitive" } },
        { userName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } }
      ];
    }

    const logs = await prisma.userLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200
    });

    // Compute metrics/stats
    const totalLogs = await prisma.userLog.count();
    const adminLogs = await prisma.userLog.count({ where: { role: "ADMIN" } });
    const studentLogs = await prisma.userLog.count({ where: { role: "STUDENT" } });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayLogins = await prisma.userLog.count({
      where: {
        createdAt: { gte: todayStart },
        action: "LOGIN"
      }
    });

    return NextResponse.json({
      success: true,
      logs,
      stats: {
        totalLogs,
        adminLogs,
        studentLogs,
        todayLogins
      }
    });
  } catch (error: any) {
    console.error("Fetch user logs API error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while fetching user logs." },
      { status: 500 }
    );
  }
}
