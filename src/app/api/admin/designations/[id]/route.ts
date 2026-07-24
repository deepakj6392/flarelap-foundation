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

function getDesignationModel() {
  try {
    let client = prisma as any;
    if (client && client.designation) {
      return client.designation;
    }
    const freshClient = resetPrismaClient() as any;
    if (freshClient && freshClient.designation) {
      return freshClient.designation;
    }
  } catch (e) {
    // Return null to trigger raw SQL fallback
  }
  return null;
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

    const designationModel = getDesignationModel();
    if (designationModel) {
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
    }

    // Raw SQL Fallback
    const cleanTitle = title ? String(title).trim() : undefined;
    const cleanStatus = status ? String(status) : undefined;

    if (cleanTitle || cleanStatus) {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "designations" SET "title" = COALESCE($1, "title"), "status" = COALESCE($2, "status") WHERE "id" = $3;`,
        cleanTitle || null,
        cleanStatus || null,
        designationId
      );
    }

    return NextResponse.json({
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

    const designationModel = getDesignationModel();
    if (designationModel) {
      await designationModel.delete({
        where: { id: designationId },
      });
      return NextResponse.json({ message: "Designation deleted successfully!" });
    }

    // Raw SQL Fallback
    await (prisma as any).$executeRawUnsafe(
      `DELETE FROM "designations" WHERE "id" = $1;`,
      designationId
    );

    return NextResponse.json({ message: "Designation deleted successfully!" });
  } catch (error: any) {
    console.error("Delete designation error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to delete designation." },
      { status: 500 }
    );
  }
}
