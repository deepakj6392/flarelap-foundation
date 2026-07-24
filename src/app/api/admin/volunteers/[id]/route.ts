import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const volunteerId = parseInt(id, 10);

    if (isNaN(volunteerId)) {
      return NextResponse.json({ message: "Invalid Volunteer ID." }, { status: 400 });
    }

    const body = await request.json();
    const {
      fullName,
      gender,
      dob,
      uidNo,
      uidFrontDoc,
      uidBackDoc,
      email,
      phone,
      education,
      specializations,
      street,
      villageCity,
      district,
      state,
      pincode,
      profilePhoto,
      agreement,
      status
    } = body;

    // Age validation if DOB provided
    if (dob) {
      const birthDate = new Date(dob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 21 || age > 65) {
          return NextResponse.json(
            { message: "Volunteer Age must be between 21 and 65 years based on Date of Birth." },
            { status: 400 }
          );
        }
      }
    }

    // UID Aadhaar Validation if provided
    if (uidNo && uidNo.trim()) {
      const cleanUid = uidNo.trim().replace(/\s+/g, "");
      if (!/^\d{12}$/.test(cleanUid)) {
        return NextResponse.json(
          { message: "UID (Aadhaar Number) must be exactly 12 digits." },
          { status: 400 }
        );
      }
    }

    const updatedVolunteer = await prisma.volunteer.update({
      where: { id: volunteerId },
      data: {
        ...(fullName !== undefined && { fullName: fullName.trim() }),
        ...(gender !== undefined && { gender }),
        ...(dob !== undefined && { dob }),
        ...(uidNo !== undefined && { uidNo: uidNo ? uidNo.trim().replace(/\s+/g, "") : null }),
        ...(uidFrontDoc !== undefined && { uidFrontDoc }),
        ...(uidBackDoc !== undefined && { uidBackDoc }),
        ...(email !== undefined && { email: email.trim().toLowerCase() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(education !== undefined && { education }),
        ...(specializations !== undefined && { specializations: specializations ? specializations.trim() : null }),
        ...(street !== undefined && { street: street ? street.trim() : null }),
        ...(villageCity !== undefined && { villageCity: villageCity ? villageCity.trim() : null }),
        ...(district !== undefined && { district: district ? district.trim() : null }),
        ...(state !== undefined && { state: state ? state.trim() : null }),
        ...(pincode !== undefined && { pincode: pincode ? pincode.trim() : null }),
        ...(profilePhoto !== undefined && { profilePhoto }),
        ...(agreement !== undefined && { agreement: Boolean(agreement) }),
        ...(status !== undefined && { status })
      }
    });

    return NextResponse.json({
      volunteer: updatedVolunteer,
      message: "Volunteer details updated successfully!"
    });
  } catch (error: any) {
    console.error("Admin volunteer update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating volunteer." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const volunteerId = parseInt(id, 10);

    if (isNaN(volunteerId)) {
      return NextResponse.json({ message: "Invalid Volunteer ID." }, { status: 400 });
    }

    await prisma.volunteer.delete({
      where: { id: volunteerId }
    });

    return NextResponse.json({ message: "Volunteer removed successfully!" });
  } catch (error: any) {
    console.error("Admin volunteer deletion error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting volunteer." },
      { status: 500 }
    );
  }
}
