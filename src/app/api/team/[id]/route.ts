import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, unlink } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { existsSync } from "fs";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    // Delete image file if it exists
    if (teamMember.imageUrl) {
      const filepath = join(process.cwd(), "public", teamMember.imageUrl);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath("/about");
    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const description = formData.get("description") as string | null;
    const facebook = formData.get("facebook") as string | null;
    const twitter = formData.get("twitter") as string | null;
    const github = formData.get("github") as string | null;
    const behance = formData.get("behance") as string | null;
    const orderStr = formData.get("order") as string | null;
    const file = formData.get("image") as File | null;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const order = orderStr ? parseInt(orderStr, 10) : 0;
    
    let imageUrl: string | undefined = undefined;

    if (file) {
      // Process new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(bytes));

      const uploadDir = join(process.cwd(), "public", "uploads", "team");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filename = `team_${Date.now()}.webp`;
      const filepath = join(uploadDir, filename);

      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(filepath);

      imageUrl = `/uploads/team/${filename}`;

      // Delete old image
      const existingMember = await prisma.teamMember.findUnique({
        where: { id },
      });
      if (existingMember?.imageUrl) {
        const oldFilepath = join(process.cwd(), "public", existingMember.imageUrl);
        if (existsSync(oldFilepath)) {
          await unlink(oldFilepath);
        }
      }
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        description,
        facebook,
        twitter,
        github,
        behance,
        order,
        ...(imageUrl && { imageUrl }),
      },
    });

    revalidatePath("/about");
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}
