import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "asc" }
      ],
    });
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const description = (formData.get("description") as string | null) || null;
    const facebook = (formData.get("facebook") as string | null) || null;
    const twitter = (formData.get("twitter") as string | null) || null;
    const github = (formData.get("github") as string | null) || null;
    const behance = (formData.get("behance") as string | null) || null;
    const orderStr = formData.get("order") as string | null;
    const file = formData.get("image") as File | null;

    if (!name || !role || !file) {
      return NextResponse.json(
        { error: "Name, role, and image are required" },
        { status: 400 }
      );
    }

    const order = orderStr ? parseInt(orderStr, 10) : 0;

    // Process Image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    const uploadDir = join(process.cwd(), "public", "uploads", "team");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    let filename = `team_${Date.now()}.webp`;
    let filepath = join(uploadDir, filename);
    let imageUrl = `/uploads/team/${filename}`;

    let sharpSaved = false;
    try {
      // Dynamic import to prevent crash in serverless environments like Vercel
      const sharpModule = await import("sharp");
      const sharp = sharpModule.default || sharpModule;
      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(filepath);
      sharpSaved = true;
    } catch (error) {
      console.warn("Sharp is not available or failed. Saving raw file instead.", error);
    }

    if (!sharpSaved) {
      // Fallback to saving the file directly with its original extension if sharp is unavailable
      const fileExt = file.name.split(".").pop() || "png";
      filename = `team_${Date.now()}.${fileExt}`;
      filepath = join(uploadDir, filename);
      imageUrl = `/uploads/team/${filename}`;
      await writeFile(filepath, buffer);
    }

    const newMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        description,
        facebook,
        twitter,
        github,
        behance,
        order,
        imageUrl,
      },
    });

    revalidatePath("/about");
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
