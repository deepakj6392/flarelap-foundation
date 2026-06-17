import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  tempPassword: string;
  createdAt: Date;
  course: {
    id: string;
    name: string;
  };
}

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const students = await prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        studentId: true,
        tempPassword: true,
        createdAt: true,
        course: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Map keys to match the frontend expectations:
    // student_id -> studentId, temp_password -> tempPassword, created_at -> createdAt
    const mappedStudents = students.map((s: any) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      student_id: s.studentId,
      temp_password: s.tempPassword,
      created_at: s.createdAt,
      course_name: s.course?.name || "None"
    }));

    return NextResponse.json({ students: mappedStudents });
  } catch (error: any) {
    console.error("Admin student fetching error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching student records." },
      { status: 500 }
    );
  }
}
