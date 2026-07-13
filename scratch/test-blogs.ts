import { prisma } from "../src/lib/prisma";

async function test() {
  try {
    console.log("Fetching blog posts...");
    const blogs = await prisma.blogPost.findMany();
    console.log("Successfully fetched blogs. Count:", blogs.length);
  } catch (error: any) {
    console.error("Error executing query:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
