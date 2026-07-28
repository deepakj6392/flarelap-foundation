import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const purchases = await prisma.purchase.findMany({
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
            name: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const mappedPurchases = purchases.map((p: any) => ({
      id: p.id,
      user_id: p.userId,
      user_name: p.user?.name || "Student User",
      user_email: p.user?.email || "",
      user_phone: p.user?.phone || "",
      student_id: p.user?.studentId || "",
      course_id: p.courseId,
      course_name: p.course?.name || "Test Series Plan",
      amount: p.amount,
      status: p.status,
      payment_method: p.paymentMethod || "Online Payment",
      transaction_id: p.transactionId,
      created_at: p.createdAt
    }));

    return NextResponse.json({ purchases: mappedPurchases });
  } catch (error: any) {
    console.error("Admin student purchases fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching purchase records." },
      { status: 500 }
    );
  }
}
