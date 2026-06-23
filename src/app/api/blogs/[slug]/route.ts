import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";

// Helper to find a blog post by slug or ID
async function findBlogPost(identifier: string) {
  const isId = /^\d+$/.test(identifier);
  if (isId) {
    return await prisma.blogPost.findUnique({
      where: { id: parseInt(identifier, 10) },
    });
  }
  return await prisma.blogPost.findUnique({
    where: { slug: identifier },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await findBlogPost(slug);

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const blog = await findBlogPost(slug);

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Delete image file if it exists and is in the uploads directory
    if (blog.thumbnail && blog.thumbnail.startsWith("/uploads/blogs/")) {
      const filepath = join(process.cwd(), "public", blog.thumbnail);
      if (existsSync(filepath)) {
        try {
          await unlink(filepath);
        } catch (err) {
          console.warn("Failed to delete image file:", filepath, err);
        }
      }
    }

    await prisma.blogPost.delete({
      where: { id: blog.id },
    });

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug: paramSlug } = await params;
    const blog = await findBlogPost(paramSlug);

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
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

    if (!title || !slug || !content || !excerpt) {
      return NextResponse.json(
        { error: "Title, slug, content, and excerpt are required" },
        { status: 400 }
      );
    }

    // If slug is changed, check uniqueness
    if (slug !== blog.slug) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const published = publishedStr === "true";
    let thumbnail: string | undefined = undefined;

    if (file) {
      // Process new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(bytes));

      const uploadDir = join(process.cwd(), "public", "uploads", "blogs");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      let filename = `blog_${Date.now()}.webp`;
      let filepath = join(uploadDir, filename);
      thumbnail = `/uploads/blogs/${filename}`;

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

      // Delete old image if it is inside dynamic uploads folder
      if (blog.thumbnail && blog.thumbnail.startsWith("/uploads/blogs/")) {
        const oldFilepath = join(process.cwd(), "public", blog.thumbnail);
        if (existsSync(oldFilepath)) {
          try {
            await unlink(oldFilepath);
          } catch (err) {
            console.warn("Failed to delete old image file:", oldFilepath, err);
          }
        }
      }
    }

    const updatedBlog = await prisma.blogPost.update({
      where: { id: blog.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        keywords: keywords || null,
        published,
        ...(thumbnail && { thumbnail }),
      },
    });

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);
    revalidatePath(`/blogs/${slug}`);
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}
