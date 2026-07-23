import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    let setting = await prisma.siteSetting.findFirst();
    if (!setting) {
      setting = await prisma.siteSetting.create({
        data: {} // creates using defaults defined in prisma schema
      });
    }
    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    console.error("Fetch site settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, phone, address, location, facebook, instagram, xLink, youtube, logoUrl } = body;

    let setting = await prisma.siteSetting.findFirst();
    if (setting) {
      setting = await prisma.siteSetting.update({
        where: { id: setting.id },
        data: {
          email: email !== undefined ? email.trim() : setting.email,
          phone: phone !== undefined ? phone.trim() : setting.phone,
          address: address !== undefined ? address.trim() : setting.address,
          location: location !== undefined ? location.trim() : setting.location,
          facebook: facebook !== undefined ? facebook.trim() : setting.facebook,
          instagram: instagram !== undefined ? instagram.trim() : setting.instagram,
          xLink: xLink !== undefined ? xLink.trim() : setting.xLink,
          youtube: youtube !== undefined ? youtube.trim() : setting.youtube,
          ...(logoUrl !== undefined && { logoUrl }),
        }
      });
    } else {
      setting = await prisma.siteSetting.create({
        data: {
          email: email ? email.trim() : undefined,
          phone: phone ? phone.trim() : undefined,
          address: address ? address.trim() : undefined,
          location: location ? location.trim() : undefined,
          facebook: facebook ? facebook.trim() : undefined,
          instagram: instagram ? instagram.trim() : undefined,
          xLink: xLink ? xLink.trim() : undefined,
          youtube: youtube ? youtube.trim() : undefined,
          logoUrl: logoUrl || "/logo.png",
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Site settings updated successfully.",
      setting
    });
  } catch (error: any) {
    console.error("Update site settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}
