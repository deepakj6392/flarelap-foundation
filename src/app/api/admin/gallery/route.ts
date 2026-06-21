import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

// GET: Fetch all gallery images
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [
        { pageName: "asc" },
        { sequence: "asc" },
        { createdAt: "desc" }
      ],
    });
    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { message: "Failed to fetch gallery images." },
      { status: 500 }
    );
  }
}

// POST: Upload a WebP image file OR add an external image URL
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string || "";
    const pageName = formData.get("pageName") as string || "General";
    const sequenceStr = formData.get("sequence") as string || "0";
    const sequence = parseInt(sequenceStr, 10) || 0;
    const externalUrl = formData.get("externalUrl") as string || "";

    // Case 1: Upload via External URL Link
    if (externalUrl) {
      const image = await prisma.galleryImage.create({
        data: {
          imageUrl: externalUrl,
          caption,
          pageName,
          sequence,
        },
      });
      return NextResponse.json({ success: true, image });
    }

    // Case 2: Upload local file (pre-converted to WebP on client side)
    if (!file) {
      return NextResponse.json(
        { message: "Please upload a file or provide an external image URL." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save target path inside public folder
    const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const filepath = path.join(uploadDir, filename);

    // Write WebP buffer to disk
    await fs.writeFile(filepath, buffer);

    const relativeUrl = `/uploads/gallery/${filename}`;

    // Create DB entry
    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: relativeUrl,
        caption,
        pageName,
        sequence,
      },
    });

    return NextResponse.json({ success: true, image });
  } catch (error: any) {
    console.error("Error uploading gallery image:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process gallery image upload." },
      { status: 500 }
    );
  }
}

// DELETE: Remove image from DB and disk (if local)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { message: "Missing image ID parameter." },
        { status: 400 }
      );
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid image ID." },
        { status: 400 }
      );
    }

    // Find image in DB
    const image = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { message: "Image record not found." },
        { status: 404 }
      );
    }

    // If local file, delete it from public/uploads/gallery
    if (image.imageUrl.startsWith("/uploads/gallery/")) {
      const filepath = path.join(process.cwd(), "public", image.imageUrl);
      try {
        await fs.unlink(filepath);
      } catch (err) {
        console.error("Local file deletion failed (might have been already deleted):", err);
      }
    }

    // Delete database record
    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Image deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete gallery image." },
      { status: 550 }
    );
  }
}
