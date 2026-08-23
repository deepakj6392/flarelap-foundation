import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

function verifyStudentToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
  try {
    const decoded: any = jwt.verify(token, jwtSecret);
    if (decoded && decoded.role === "student") {
      return decoded;
    }
  } catch (err) {
    return null;
  }
  return null;
}

export async function GET(request: Request) {
  const studentToken = verifyStudentToken(request);
  if (!studentToken) {
    return NextResponse.json({ message: "Unauthorized. Student token required." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: studentToken.id },
      include: {
        course: true,
        category: true
      }
    });

    if (!user) {
      return NextResponse.json({ message: "Student record not found." }, { status: 404 });
    }

    const studentData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      address: user.address,
      student_id: user.studentId,
      created_at: user.createdAt,
      course_id: user.courseId,
      course_name: user.course?.name || "None",
      category_id: user.categoryId,
      category_name: user.category?.name || "None"
    };

    return NextResponse.json({ success: true, user: studentData });
  } catch (error: any) {
    console.error("Fetch student profile error:", error);
    return NextResponse.json({ message: "Failed to fetch student profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const studentToken = verifyStudentToken(request);
  if (!studentToken) {
    return NextResponse.json({ message: "Unauthorized. Student token required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, dob, address } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ message: "Full Name is required." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: studentToken.id },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        dob: dob ? dob.trim() : null,
        address: address ? address.trim() : null
      },
      include: {
        course: true,
        category: true
      }
    });

    const updatedStudentData = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      dob: updatedUser.dob,
      address: updatedUser.address,
      student_id: updatedUser.studentId,
      created_at: updatedUser.createdAt,
      course_id: updatedUser.courseId,
      course_name: updatedUser.course?.name || "None",
      category_id: updatedUser.categoryId,
      category_name: updatedUser.category?.name || "None"
    };

    return NextResponse.json({
      success: true,
      message: "Student profile updated successfully.",
      user: updatedStudentData
    });
  } catch (error: any) {
    console.error("Update student profile error:", error);
    return NextResponse.json({ message: "Failed to update profile." }, { status: 500 });
  }
}
