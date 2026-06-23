import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";

    let blogs;
    if (adminMode) {
      const authorized = verifyAdmin(req);
      if (!authorized) {
        blogs = await prisma.blogPost.findMany({
          where: { published: true },
          orderBy: { createdAt: "desc" },
        });
      } else {
        blogs = await prisma.blogPost.findMany({
          orderBy: { createdAt: "desc" },
        });
      }
    } else {
      blogs = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
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
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const metaTitle = formData.get("metaTitle") as string | null;
    const metaDesc = formData.get("metaDesc") as string | null;
    const keywords = formData.get("keywords") as string | null;
    const publishedStr = formData.get("published") as string;
    const file = formData.get("image") as File | null;

    if (!title || !slug || !content || !excerpt || !file) {
      return NextResponse.json(
        { error: "Title, slug, content, excerpt, and thumbnail image are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const published = publishedStr === "true";

    // Process Image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    const uploadDir = join(process.cwd(), "public", "uploads", "blogs");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    let filename = `blog_${Date.now()}.webp`;
    let filepath = join(uploadDir, filename);
    let thumbnail = `/uploads/blogs/${filename}`;

    let sharpSaved = false;
    try {
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
      const fileExt = file.name.split(".").pop() || "png";
      filename = `blog_${Date.now()}.${fileExt}`;
      filepath = join(uploadDir, filename);
      thumbnail = `/uploads/blogs/${filename}`;
      await writeFile(filepath, buffer);
    }

    const newBlog = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        thumbnail,
        excerpt,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        keywords: keywords || null,
        published,
      },
    });

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
