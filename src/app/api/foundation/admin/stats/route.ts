import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const contactsCountRes = await query("SELECT COUNT(*)::int as count FROM contacts");
    const newsletterCountRes = await query("SELECT COUNT(*)::int as count FROM newsletter");
    
    // Donations stats
    const totalDonationsRes = await query("SELECT COALESCE(SUM(amount), 0)::float as sum, COUNT(*)::int as count FROM donations");
    const todayDonationsRes = await query("SELECT COALESCE(SUM(amount), 0)::float as sum FROM donations WHERE created_at >= CURRENT_DATE");

    // Student purchases stats (where status = 'COMPLETED')
    const totalPurchasesRes = await query("SELECT COALESCE(SUM(amount), 0)::float as sum, COUNT(*)::int as count FROM purchases WHERE status = 'COMPLETED'");
    const todayPurchasesRes = await query("SELECT COALESCE(SUM(amount), 0)::float as sum FROM purchases WHERE status = 'COMPLETED' AND created_at >= CURRENT_DATE");

    const totalContacts = contactsCountRes.rows[0]?.count || 0;
    const totalSubscribers = newsletterCountRes.rows[0]?.count || 0;
    
    const donationsSum = totalDonationsRes.rows[0]?.sum || 0;
    const donationsCount = totalDonationsRes.rows[0]?.count || 0;
    const todayDonationsSum = todayDonationsRes.rows[0]?.sum || 0;

    const purchasesSum = totalPurchasesRes.rows[0]?.sum || 0;
    const purchasesCount = totalPurchasesRes.rows[0]?.count || 0;
    const todayPurchasesSum = todayPurchasesRes.rows[0]?.sum || 0;

    const totalPayments = donationsSum + purchasesSum;
    const todayPayments = todayDonationsSum + todayPurchasesSum;

    // Fetch recent student purchases with student and course info
    let recentPurchases: any[] = [];
    try {
      const purchases = await prisma.purchase.findMany({
        where: { status: "COMPLETED" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              studentId: true
            }
          },
          course: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 5
      });

      recentPurchases = purchases.map((p: any) => ({
        id: p.id,
        user_name: p.user?.name || "Student User",
        user_email: p.user?.email || "",
        user_phone: p.user?.phone || "",
        student_id: p.user?.studentId || "",
        course_name: p.course?.name || "Test Series Plan",
        amount: p.amount,
        payment_method: p.paymentMethod || "Online Payment",
        transaction_id: p.transactionId,
        status: p.status,
        created_at: p.createdAt
      }));
    } catch (e) {
      console.error("Error fetching recent purchases for admin stats:", e);
    }

    return NextResponse.json({
      stats: {
        totalContacts,
        totalSubscribers,
        totalPayments,
        totalStudentPayments: purchasesSum,
        totalDonationsSum: donationsSum,
        totalDonationsCount: donationsCount,
        totalPurchasesCount: purchasesCount,
        todayPayments,
        recentPurchases
      },
    });
  } catch (error: any) {
    console.error("Stats fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching dashboard statistics." },
      { status: 500 }
    );
  }
}

