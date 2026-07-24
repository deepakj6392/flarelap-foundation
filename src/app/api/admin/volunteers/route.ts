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

    // Ensure all volunteers have a valid Member ID
    const updatedVolunteers = await Promise.all(
      volunteers.map(async (v) => {
        if (!v.memberId) {
          const digitsOnly = (v.phone || "").replace(/\D/g, "");
          const phoneLast2 = digitsOnly.length >= 2 ? digitsOnly.slice(-2) : "00";
          const yearLast2 = (v.createdAt ? new Date(v.createdAt) : new Date()).getFullYear().toString().slice(-2);
          const mId = `FGF-00${phoneLast2}${yearLast2}`;
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
      memberSince,
      expiryDate
    } = body;

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

    // Generate Unique Member ID: FGF-00 + (Last 2 digits of phone) + (Last 2 digits of current year)
    const digitsOnly = phone.trim().replace(/\D/g, "");
    const phoneLast2 = digitsOnly.length >= 2 ? digitsOnly.slice(-2) : "00";
    const yearLast2 = new Date().getFullYear().toString().slice(-2);
    let generatedMemberId = `FGF-00${phoneLast2}${yearLast2}`;

    // Ensure uniqueness
    const existingMember = await prisma.volunteer.findFirst({
      where: { memberId: generatedMemberId }
    });
    if (existingMember) {
      const count = await prisma.volunteer.count({
        where: { memberId: { startsWith: generatedMemberId } }
      });
      generatedMemberId = `${generatedMemberId}-${count + 1}`;
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
        memberSince: memberSince || null,
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
