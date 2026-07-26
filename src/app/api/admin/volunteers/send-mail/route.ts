import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { sendVolunteerEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const authResult = await verifyAuth(req);
    if (!authResult.valid) {
      return NextResponse.json({ message: authResult.message }, { status: 401 });
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
        email: true
      }
    });

    const recipientEmails = Array.from(
      new Set(volunteers.map((v) => v.email.trim()).filter((e) => e && e.includes("@")))
    );

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { message: "No valid email addresses found for the selected volunteers." },
        { status: 400 }
      );
    }

    // Send email using Nodemailer helper
    const result = await sendVolunteerEmail(recipientEmails, subject.trim(), message);

    if (!result.success) {
      return NextResponse.json(
        { message: "Failed to send email. Please verify SMTP server settings." },
        { status: 500 }
      );
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
