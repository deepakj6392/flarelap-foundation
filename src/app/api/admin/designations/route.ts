import { NextResponse } from "next/server";
import { prisma, resetPrismaClient } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "flarelap-secret-key-2026";

async function verifyAdmin(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "ADMIN") return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    let designationModel = (prisma as any).designation;
    if (!designationModel) {
      designationModel = (resetPrismaClient() as any).designation;
    }

    const designations = await designationModel.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ designations });
  } catch (error: any) {
    console.error("Fetch designations error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch designations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { message: "Designation title is required." },
        { status: 400 }
      );
    }

    let designationModel = (prisma as any).designation;
    if (!designationModel) {
      designationModel = (resetPrismaClient() as any).designation;
    }

    const cleanTitle = title.trim();

    // Check duplicate
    const existing = await designationModel.findUnique({
      where: { title: cleanTitle },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Designation title already exists." },
        { status: 400 }
      );
    }

    const newDesignation = await designationModel.create({
      data: {
        title: cleanTitle,
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json({
      designation: newDesignation,
      message: "Designation added successfully!",
    });
  } catch (error: any) {
    console.error("Create designation error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to create designation." },
      { status: 500 }
    );
  }
}
