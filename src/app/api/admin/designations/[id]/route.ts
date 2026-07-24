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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const designationId = parseInt(resolvedParams.id, 10);
    if (isNaN(designationId)) {
      return NextResponse.json({ message: "Invalid designation ID." }, { status: 400 });
    }

    const body = await request.json();
    const { title, status } = body;

    let designationModel = (prisma as any).designation;
    if (!designationModel) {
      designationModel = (resetPrismaClient() as any).designation;
    }

    const updateData: any = {};
    if (title !== undefined && title !== null) {
      updateData.title = String(title).trim();
    }
    if (status !== undefined && status !== null) {
      updateData.status = String(status);
    }

    const updated = await designationModel.update({
      where: { id: designationId },
      data: updateData,
    });

    return NextResponse.json({
      designation: updated,
      message: "Designation updated successfully!",
    });
  } catch (error: any) {
    console.error("Update designation error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to update designation." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const designationId = parseInt(resolvedParams.id, 10);
    if (isNaN(designationId)) {
      return NextResponse.json({ message: "Invalid designation ID." }, { status: 400 });
    }

    let designationModel = (prisma as any).designation;
    if (!designationModel) {
      designationModel = (resetPrismaClient() as any).designation;
    }

    await designationModel.delete({
      where: { id: designationId },
    });

    return NextResponse.json({ message: "Designation deleted successfully!" });
  } catch (error: any) {
    console.error("Delete designation error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to delete designation." },
      { status: 500 }
    );
  }
}
