import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    const volunteerId = parseInt(id, 10);

    if (isNaN(volunteerId)) {
      return NextResponse.json({ message: "Invalid Volunteer ID." }, { status: 400 });
    }

    const volunteerModel = (prisma as any).volunteer;
    if (!volunteerModel) {
      return NextResponse.json(
        { message: "Database model delegate not ready." },
        { status: 500 }
      );
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
      status,
      memberSince,
      membersSince,
      expiryDate
    } = body;

    const finalMemberSince = memberSince !== undefined ? memberSince : membersSince;

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
    if (uidNo && typeof uidNo === "string" && uidNo.trim()) {
      const cleanUid = uidNo.trim().replace(/\s+/g, "");
      if (!/^\d{12}$/.test(cleanUid)) {
        return NextResponse.json(
          { message: "UID (Aadhaar Number) must be exactly 12 digits." },
          { status: 400 }
        );
      }
    }

    const updatedVolunteer = await volunteerModel.update({
      where: { id: volunteerId },
      data: {
        ...(fullName !== undefined && fullName !== null && { fullName: String(fullName).trim() }),
        ...(gender !== undefined && { gender }),
        ...(dob !== undefined && { dob }),
        ...(uidNo !== undefined && { uidNo: uidNo ? String(uidNo).trim().replace(/\s+/g, "") : null }),
        ...(uidFrontDoc !== undefined && { uidFrontDoc }),
        ...(uidBackDoc !== undefined && { uidBackDoc }),
        ...(email !== undefined && email !== null && { email: String(email).trim().toLowerCase() }),
        ...(phone !== undefined && phone !== null && { phone: String(phone).trim() }),
        ...(education !== undefined && { education }),
        ...(specializations !== undefined && { specializations: specializations ? String(specializations).trim() : null }),
        ...(street !== undefined && { street: street ? String(street).trim() : null }),
        ...(villageCity !== undefined && { villageCity: villageCity ? String(villageCity).trim() : null }),
        ...(district !== undefined && { district: district ? String(district).trim() : null }),
        ...(state !== undefined && { state: state ? String(state).trim() : null }),
        ...(pincode !== undefined && { pincode: pincode ? String(pincode).trim() : null }),
        ...(profilePhoto !== undefined && { profilePhoto }),
        ...(agreement !== undefined && { agreement: Boolean(agreement) }),
        ...(status !== undefined && { status }),
        ...(finalMemberSince !== undefined && { memberSince: finalMemberSince || null }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate || null })
      }
    });

    return NextResponse.json({
      volunteer: updatedVolunteer,
      message: "Volunteer details updated successfully!"
    });
  } catch (error: any) {
    console.error("Admin volunteer update error:", error);
    return NextResponse.json(
      { message: error?.message || "An error occurred while updating volunteer." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    const volunteerId = parseInt(id, 10);

    if (isNaN(volunteerId)) {
      return NextResponse.json({ message: "Invalid Volunteer ID." }, { status: 400 });
    }

    const volunteerModel = (prisma as any).volunteer;
    if (!volunteerModel) {
      return NextResponse.json({ message: "Database model not available." }, { status: 500 });
    }

    await volunteerModel.delete({
      where: { id: volunteerId }
    });

    return NextResponse.json({ message: "Volunteer removed successfully!" });
  } catch (error: any) {
    console.error("Admin volunteer deletion error:", error);
    return NextResponse.json(
      { message: error?.message || "An error occurred while deleting volunteer." },
      { status: 500 }
    );
  }
}
