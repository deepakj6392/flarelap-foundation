import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { createdAt: "desc" }
    });

    // Ensure all volunteers have a valid Member ID in new format (FGF-YYMM01)
    const updatedVolunteers = await Promise.all(
      volunteers.map(async (v) => {
        if (!v.memberId || v.memberId.startsWith("FGF-00")) {
          const created = v.createdAt ? new Date(v.createdAt) : new Date();
          const yearLast2 = created.getFullYear().toString().slice(-2);
          const month2 = String(created.getMonth() + 1).padStart(2, "0");
          const suffix = String(v.id || 1).padStart(2, "0").slice(-2);
          const mId = `FGF-${yearLast2}${month2}${suffix}`;
          try {
            await prisma.volunteer.update({
              where: { id: v.id },
              data: { memberId: mId }
            });
            return { ...v, memberId: mId };
          } catch (e) {
            return v;
          }
        }
        return v;
      })
    );

    return NextResponse.json({ volunteers: updatedVolunteers });
  } catch (error: any) {
    console.error("Admin volunteers fetch error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching volunteers." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
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
      designation,
      memberSince,
      membersSince,
      expiryDate
    } = body;

    const finalMemberSince = memberSince || membersSince || null;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ message: "Volunteer Full Name is required." }, { status: 400 });
    }

    if (!gender) {
      return NextResponse.json({ message: "Gender selection is required." }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ message: "Email Address is required." }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ message: "Phone Number is required." }, { status: 400 });
    }

    // Age validation (21-65 years) if DOB provided
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

    // Generate Unique Member ID: FGF- + (2 digit Year) + (2 digit Month) + (2 digit suffix) -> e.g. FGF-260701
    const createdDate = new Date();
    const yearLast2 = createdDate.getFullYear().toString().slice(-2);
    const month2 = String(createdDate.getMonth() + 1).padStart(2, "0");
    const monthPrefix = `FGF-${yearLast2}${month2}`;

    const countInMonth = await prisma.volunteer.count({
      where: { memberId: { startsWith: monthPrefix } }
    });
    const suffix = String(countInMonth + 1).padStart(2, "0");
    let generatedMemberId = `${monthPrefix}${suffix}`;

    // Ensure uniqueness
    const existingMember = await prisma.volunteer.findFirst({
      where: { memberId: generatedMemberId }
    });
    if (existingMember) {
      const totalCount = await prisma.volunteer.count();
      generatedMemberId = `${monthPrefix}${String(totalCount + 1).padStart(2, "0")}`;
    }

    const newVolunteer = await prisma.volunteer.create({
      data: {
        memberId: generatedMemberId,
        fullName: fullName.trim(),
        gender: gender || "Male",
        dob: dob || "",
        uidNo: uidNo ? uidNo.trim().replace(/\s+/g, "") : null,
        uidFrontDoc: uidFrontDoc || null,
        uidBackDoc: uidBackDoc || null,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        education: education || "Graduate",
        specializations: specializations ? specializations.trim() : null,
        street: street ? street.trim() : null,
        villageCity: villageCity ? villageCity.trim() : null,
        district: district ? district.trim() : null,
        state: state ? state.trim() : null,
        pincode: pincode ? pincode.trim() : null,
        profilePhoto: profilePhoto || null,
        agreement: agreement !== undefined ? Boolean(agreement) : true,
        status: status || "APPROVED",
        designation: designation ? designation.trim() : "Volunteer",
        memberSince: finalMemberSince,
        expiryDate: expiryDate || null
      }
    });

    return NextResponse.json({
      volunteer: newVolunteer,
      message: "Volunteer added successfully!"
    });
  } catch (error: any) {
    console.error("Admin volunteer creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while adding volunteer." },
      { status: 500 }
    );
  }
}
