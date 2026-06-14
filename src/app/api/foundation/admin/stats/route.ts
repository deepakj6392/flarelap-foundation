import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const contactsCountRes = await query("SELECT COUNT(*)::int as count FROM contacts");
    const newsletterCountRes = await query("SELECT COUNT(*)::int as count FROM newsletter");
    const totalPaymentsRes = await query("SELECT COALESCE(SUM(amount), 0)::float as sum, COUNT(*)::int as count FROM donations");
    const todayPaymentsRes = await query("SELECT COALESCE(SUM(amount), 0)::float as sum FROM donations WHERE created_at >= CURRENT_DATE");

    const totalContacts = contactsCountRes.rows[0]?.count || 0;
    const totalSubscribers = newsletterCountRes.rows[0]?.count || 0;
    const totalPayments = totalPaymentsRes.rows[0]?.sum || 0;
    const totalDonationsCount = totalPaymentsRes.rows[0]?.count || 0;
    const todayPayments = todayPaymentsRes.rows[0]?.sum || 0;

    return NextResponse.json({
      stats: {
        totalContacts,
        totalSubscribers,
        totalPayments,
        totalDonationsCount,
        todayPayments,
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
