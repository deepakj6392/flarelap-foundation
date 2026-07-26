import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
import { sendVolunteerEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const admin = verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { volunteerIds, subject, message } = await req.json();

    if (!volunteerIds || !Array.isArray(volunteerIds) || volunteerIds.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one volunteer recipient." },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { message: "Subject line is required." },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { message: "Email message content is required." },
        { status: 400 }
      );
    }

    // Fetch target volunteers from DB
    const volunteers = await prisma.volunteer.findMany({
      where: {
        id: { in: volunteerIds }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        designation: true,
        memberId: true,
        createdAt: true
      }
    });

    const validVolunteers = volunteers.filter((v) => v.email && v.email.includes("@"));

    if (validVolunteers.length === 0) {
      return NextResponse.json(
        { message: "No valid email addresses found for the selected volunteers." },
        { status: 400 }
      );
    }

    // Format member ID for each recipient
    const recipientDetails = validVolunteers.map((v) => {
      let mId = v.memberId;
      if (!mId || mId.startsWith("FGF-00")) {
        const created = v.createdAt ? new Date(v.createdAt) : new Date();
        const yearLast2 = created.getFullYear().toString().slice(-2);
        const month2 = String(created.getMonth() + 1).padStart(2, "0");
        const suffix = String(v.id || 1).padStart(2, "0").slice(-2);
        mId = `FGF-${yearLast2}${month2}${suffix}`;
      }
      return {
        fullName: v.fullName,
        email: v.email.trim(),
        phone: v.phone || "N/A",
        memberId: mId,
        designation: v.designation || "Volunteer"
      };
    });

    // Send email using Nodemailer helper
    const result = await sendVolunteerEmail(recipientDetails, subject.trim(), message);

    if (!result.success) {
      return NextResponse.json(
        { message: "Failed to send email. Please verify SMTP server settings." },
        { status: 500 }
      );
    }

    // Create log record in database
    try {
      await prisma.volunteerMailLog.create({
        data: {
          subject: subject.trim(),
          message: message,
          recipients: JSON.stringify(recipientDetails),
          recipientsCount: result.count,
          status: "SENT"
        }
      });
    } catch (logErr) {
      console.error("Failed to create mail log entry:", logErr);
    }

    return NextResponse.json({
      message: `Email sent successfully to ${result.count} volunteer(s).`,
      count: result.count
    });
  } catch (error: any) {
    console.error("Send volunteer email API error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while sending email." },
      { status: 500 }
    );
  }
}
