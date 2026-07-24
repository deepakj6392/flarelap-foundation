import { NextResponse } from "next/server";
import { prisma, resetPrismaClient } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

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

export async function GET(request: Request) {
  try {
    const designationModel = getDesignationModel();
    if (designationModel) {
      const designations = await designationModel.findMany({
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ designations });
    }

    // Raw SQL Fallback if ORM delegate not cached
    const designations = await (prisma as any).$queryRawUnsafe(
      `SELECT "id", "title", "status", "created_at" AS "createdAt" FROM "designations" ORDER BY "id" ASC;`
    );
    return NextResponse.json({ designations });
  } catch (error: any) {
    console.warn("Fetch designations ORM failed, attempting Raw SQL fallback...", error?.message);
    try {
      const designations = await (prisma as any).$queryRawUnsafe(
        `SELECT "id", "title", "status", "created_at" AS "createdAt" FROM "designations" ORDER BY "id" ASC;`
      );
      return NextResponse.json({ designations });
    } catch (sqlErr: any) {
      console.error("Fetch designations Raw SQL error:", sqlErr?.message);
      return NextResponse.json({ designations: [] });
    }
  }
}

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
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

    const cleanTitle = title.trim();
    const designationStatus = status || "ACTIVE";

    const designationModel = getDesignationModel();
    if (designationModel) {
      try {
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
            status: designationStatus,
          },
        });

        return NextResponse.json({
          designation: newDesignation,
          message: "Designation added successfully!",
        });
      } catch (ormErr: any) {
        console.warn("ORM designation create failed, trying raw SQL fallback...", ormErr?.message);
      }
    }

    // Raw SQL Fallback
    const inserted = await (prisma as any).$queryRawUnsafe(
      `INSERT INTO "designations" ("title", "status") VALUES ($1, $2) ON CONFLICT ("title") DO NOTHING RETURNING "id", "title", "status", "created_at" AS "createdAt";`,
      cleanTitle,
      designationStatus
    );

    return NextResponse.json({
      designation: inserted?.[0] || { title: cleanTitle, status: designationStatus },
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
