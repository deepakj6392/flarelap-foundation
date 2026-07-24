"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  HeartHandshake,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  CreditCard,
  FileText,
  Building,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  CheckSquare,
  Filter,
  RefreshCw,
  Award,
  Printer,
  Download,
  FileCheck
} from "lucide-react";

interface Volunteer {
  id: number;
  memberId?: string | null;
  profilePhoto?: string | null;
  fullName: string;
  gender: string;
  dob: string;
  uidNo?: string | null;
  uidFrontDoc?: string | null;
  uidBackDoc?: string | null;
  email: string;
  phone: string;
  education: string;
  specializations?: string | null;
  street?: string | null;
  villageCity?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  agreement: boolean;
  status: string;
  memberSince?: string | null;
  expiryDate?: string | null;
  createdAt: string;
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [educationFilter, setEducationFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editVolunteerId, setEditVolunteerId] = useState<number | null>(null);

  // View Details / Document Modal State
  const [viewVolunteer, setViewVolunteer] = useState<Volunteer | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<"details" | "certificate" | "idcard">("details");
  const [viewDocImage, setViewDocImage] = useState<{ title: string; url: string } | null>(null);

  // Member Since & Expiry Date State
  const [memberSince, setMemberSince] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [savingDates, setSavingDates] = useState(false);

  // Safe Date Formatter helper
  const formatDateSafe = (dateVal: string | null | undefined, defaultDate: Date): string => {
    if (!dateVal) {
      return defaultDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      return defaultDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Print / Download ID Card Helper
  const handlePrintIdCard = (v: Volunteer, customMemberSince?: string, customExpiryDate?: string) => {
    const displayMemberId = v.memberId || `FGF-00${v.phone ? v.phone.replace(/\D/g, "").slice(-2) : "00"}26`;
    const regDate = v.createdAt ? new Date(v.createdAt) : new Date();

    const mSince = customMemberSince !== undefined && customMemberSince !== "" ? customMemberSince : v.memberSince;
    const mExp = customExpiryDate !== undefined && customExpiryDate !== "" ? customExpiryDate : v.expiryDate;

    const defaultStart = new Date(regDate.getFullYear() - 1, regDate.getMonth(), regDate.getDate());
    const defaultEnd = regDate;

    const startDateStr = formatDateSafe(mSince, defaultStart);
    const endDateStr = formatDateSafe(mExp, defaultEnd);

    const photoUrl = v.profilePhoto || "/favicon.ico";
    const qrData = encodeURIComponent(`https://flarelapfoundation.org/verify-volunteer?id=${displayMemberId}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Volunteer ID Card - ${v.fullName}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body {
            margin: 0;
            padding: 20px;
            background: #f1f5f9;
            font-family: Arial, Helvetica, sans-serif;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            box-sizing: border-box;
          }
          .cards-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            justify-content: center;
            align-items: center;
          }
          .id-card {
            width: 320px;
            height: 510px;
            background: #ffffff;
            border-radius: 18px;
            border: 2px solid #cbd5e1;
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
            overflow: hidden;
            position: relative;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          .card-header-gradient {
            background: linear-gradient(135deg, #0038a8 0%, #5b127d 50%, #e60067 100%);
            padding: 16px 14px;
            color: #ffffff;
            position: relative;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          }
          .clip-hole {
            width: 36px;
            height: 12px;
            background: #ffffff;
            border: 2px solid #94a3b8;
            border-radius: 10px;
            margin: 0 auto 10px auto;
            opacity: 0.95;
          }
          .header-brand {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .star-logo-icon {
            width: 44px;
            height: 44px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          }
          .brand-title {
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            line-height: 1.15;
            color: #ffffff;
          }
          .brand-tagline {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 1px;
            opacity: 0.9;
            color: #f1f5f9;
            margin-top: 2px;
          }
          .accent-strip {
            height: 4px;
            background: linear-gradient(90deg, #38bdf8 0%, #34d399 50%, #fbbf24 100%);
          }
          .card-body-front {
            padding: 14px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: radial-gradient(circle at 90% 10%, rgba(224,231,255,0.4) 0%, rgba(255,255,255,1) 70%);
            position: relative;
          }
          .photo-info-row {
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }
          .photo-frame {
            width: 98px;
            height: 120px;
            border-radius: 10px;
            border: 2.5px solid #1e293b;
            object-fit: cover;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            background: #e2e8f0;
          }
          .info-column {
            flex: 1;
            font-size: 11px;
          }
          .info-label {
            font-size: 8.5px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 3px;
          }
          .info-val {
            font-size: 10.5px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
          }
          .info-val-highlight {
            color: #2563eb;
            font-family: monospace;
            font-size: 12px;
          }
          .volunteer-name {
            font-size: 15px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            margin-top: 8px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 4px;
            letter-spacing: 0.5px;
          }
          .sig-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 8px;
          }
          .sig-text {
            font-family: 'Brush Script MT', 'Great Vibes', cursive, 'Times New Roman';
            font-size: 20px;
            color: #0f172a;
          }
          .sig-label {
            font-size: 8px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            border-top: 1px solid #cbd5e1;
            padding-top: 2px;
            width: 90px;
          }
          .stamp-badge {
            border: 2px solid #16a34a;
            color: #16a34a;
            font-size: 8px;
            font-weight: 900;
            text-transform: uppercase;
            padding: 2px 6px;
            border-radius: 4px;
            transform: rotate(-6deg);
            display: inline-block;
            background: #f0fdf4;
          }
          .qr-holo-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
          }
          .qr-card-img {
            width: 50px;
            height: 50px;
          }
          .holo-badge {
            background: linear-gradient(135deg, #0284c7, #818cf8, #f43f5e);
            color: #ffffff;
            font-size: 8.5px;
            font-weight: 900;
            padding: 4px 8px;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            letter-spacing: 1px;
          }
          .card-footer-front {
            background: #0f172a;
            color: #ffffff;
            text-align: center;
            padding: 6px 10px;
            font-size: 7.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .holo-side-strip {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 14px;
            background: repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 4px, #cbd5e1 4px, #cbd5e1 8px);
            border-right: 1px solid #cbd5e1;
          }
          .back-content {
            margin-left: 10px;
          }
          .rules-title {
            font-size: 9.5px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            margin-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 2px;
          }
          .rules-list {
            font-size: 8px;
            color: #334155;
            line-height: 1.45;
            padding-left: 0;
            list-style: none;
            margin: 0;
          }
          .rules-list li {
            margin-bottom: 4px;
          }
          .validity-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 5px;
            text-align: center;
            font-size: 8.5px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 8px;
          }
          @media print {
            body { padding: 0; background: white; }
            .id-card { box-shadow: none; border-width: 1.5px; page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="cards-wrapper">
          <!-- FRONT SIDE -->
          <div class="id-card">
            <div class="card-header-gradient" style="padding: 0; height: 95px;">
              <div class="clip-hole" style="position: absolute; top: 6px; left: 50%; transform: translateX(-50%); z-index: 10; margin: 0;"></div>
              <img src="/id-banner.jpg" alt="Flarelap Global Foundation Banner" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            </div>
            <div class="accent-strip"></div>

            <div class="card-body-front">
              <div class="photo-info-row">
                <img src="${photoUrl}" alt="${v.fullName}" class="photo-frame" onerror="this.src='/favicon.ico'" />
                <div class="info-column">
                  <div class="info-label">MEMBER ID</div>
                  <div class="info-val info-val-highlight">${displayMemberId}</div>

                  <div class="info-label">DESIGNATION</div>
                  <div class="info-val">Volunteer Member</div>

                  <div class="info-label">MEMBER SINCE</div>
                  <div class="info-val">${startDateStr}</div>

                  <div class="info-label">EXPIRY DATE</div>
                  <div class="info-val">${endDateStr}</div>
                </div>
              </div>

              <div>
                <div class="volunteer-name">${v.fullName}</div>
                <div class="sig-row">
                  <div>
                    <div class="sig-text">${v.fullName.split(' ')[0]}</div>
                    <div class="sig-label">MEMBER SIGNATURE</div>
                  </div>
                  <div class="stamp-badge">✓ APPROVED</div>
                </div>
              </div>

              <div class="qr-holo-row">
                <img src="${qrUrl}" alt="QR" class="qr-card-img" />
                <div class="holo-badge">★ OFFICIAL MEMBER</div>
              </div>
            </div>

            <div class="card-footer-front">
              VALIDATED MEMBER ID CARD • WWW.FLARELAPFOUNDATION.ORG
            </div>
          </div>

          <!-- BACK SIDE -->
          <div class="id-card">
            <div class="card-header-gradient" style="padding: 0; height: 95px;">
              <div class="clip-hole" style="position: absolute; top: 6px; left: 50%; transform: translateX(-50%); z-index: 10; margin: 0;"></div>
              <img src="/id-banner.jpg" alt="Flarelap Global Foundation Banner" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            </div>
            <div class="accent-strip"></div>

            <div class="card-body-front">
              <div class="holo-side-strip"></div>
              <div class="back-content">
                <div class="rules-title">CARDHOLDER RULES & CONTACT</div>
                <ul class="rules-list">
                  <li>1. THIS CARD IS PROPERTY OF FLARELAP GLOBAL FOUNDATION.</li>
                  <li>2. IT MUST BE PRODUCED UPON REQUEST BY AUTHORIZED PERSONNEL.</li>
                  <li>3. FOUND CARDS SHOULD BE RETURNED TO: GLOBAL HEADQUARTERS, SIRSAL (38) KAITHAL, HARYANA, INDIA. PIN- 136026.</li>
                  <li>4. FOR EMERGENCIES, CONTACT SECURITY: +91 9729817600.</li>
                  <li>5. MISUSE SUBJECT TO DISCIPLINARY ACTION.</li>
                </ul>

                <div class="validity-box">
                  ISSUE DATE: ${startDateStr} &nbsp;|&nbsp; VALID UNTIL: ${endDateStr}
                </div>

                <div class="sig-row" style="margin-top: 14px;">
                  <div>
                    <div class="sig-text">Bharat Bhushan</div>
                    <div class="sig-label">AUTHORIZED SIGNATORY</div>
                  </div>
                  <img src="${qrUrl}" alt="QR" class="qr-card-img" style="width: 44px; height: 44px;" />
                </div>
              </div>

              <div class="card-footer-front" style="margin-top: auto; margin-left: -14px; margin-right: -14px; margin-bottom: -14px;">
                FOUNDATION HEADQUARTERS • KAITHAL, HARYANA, INDIA
              </div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Print / Download Certificate Helper
  const handlePrintCertificate = (v: Volunteer, customMemberSince?: string, customExpiryDate?: string) => {
    const displayMemberId = v.memberId || `FGF-00${v.phone ? v.phone.replace(/\D/g, "").slice(-2) : "00"}26`;
    const regDate = v.createdAt ? new Date(v.createdAt) : new Date();

    const mSince = customMemberSince !== undefined ? customMemberSince : v.memberSince;
    const mExp = customExpiryDate !== undefined ? customExpiryDate : v.expiryDate;

    const defaultStart = new Date(regDate.getFullYear() - 1, regDate.getMonth(), regDate.getDate());
    const defaultEnd = regDate;

    const startDateStr = formatDateSafe(mSince, defaultStart);
    const endDateStr = formatDateSafe(mExp, defaultEnd);

    const issueDateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const qrData = encodeURIComponent(`https://flarelapfoundation.org/verify-volunteer?id=${displayMemberId}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Appreciation - ${v.fullName}</title>
        <style>
          @page { size: A4 landscape; margin: 0; }
          body {
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            font-family: 'Times New Roman', Times, serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
          }
          .cert-outer {
            width: 1000px;
            background: #ffffff;
            border: 10px solid #1e293b;
            padding: 6px;
            box-sizing: border-box;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          .cert-inner {
            border: 2px solid #334155;
            padding: 35px 45px;
            text-align: center;
            position: relative;
          }
          .cert-header {
            font-size: 32px;
            font-weight: 900;
            color: #1e3a8a;
            letter-spacing: 1px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .cert-logo {
            height: 90px;
            width: 90px;
            margin: 0 auto 15px auto;
            border-radius: 16px;
            object-fit: contain;
          }
          .cert-title {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 1.5px;
            margin-bottom: 25px;
            text-transform: uppercase;
          }
          .cert-body {
            font-size: 15px;
            line-height: 1.8;
            color: #1e293b;
            max-width: 860px;
            margin: 0 auto;
            text-align: justify;
            text-align-last: center;
          }
          .highlight {
            color: #dc2626;
            font-weight: bold;
          }
          .cert-meta {
            margin-top: 25px;
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
          }
          .cert-footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 15px;
          }
          .qr-img {
            width: 95px;
            height: 95px;
          }
          .sig-box {
            border: 1.5px solid #86efac;
            border-radius: 16px;
            padding: 10px 35px;
            text-align: center;
            background: #fafafa;
          }
          .sig-cursive {
            font-family: 'Brush Script MT', 'Great Vibes', cursive, 'Times New Roman';
            font-size: 32px;
            color: #0f172a;
            font-style: italic;
          }
          .sig-title {
            font-family: Arial, sans-serif;
            font-size: 13px;
            font-weight: bold;
            color: #1e293b;
            margin-top: 2px;
          }
          @media print {
            body { padding: 0; background: white; }
            .cert-outer { width: 100%; border-width: 8px; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="cert-outer">
          <div class="cert-inner">
            <div class="cert-header">FLARELAP GLOBAL FOUNDATION</div>
            <img src="/logo.png" alt="Logo" class="cert-logo" onerror="this.src='/favicon.ico'" />
            <div class="cert-title">CERTIFICATE OF APPRECIATION</div>
            <div class="cert-body">
              This certificate is proudly presented to <span class="highlight">${v.fullName}</span> in deep gratitude for their outstanding dedication and selfless service as a Volunteer with <span class="highlight">Flarelap Global Foundation</span> from <span class="highlight">${startDateStr}</span> to <span class="highlight">${endDateStr}</span>. During their tenure, they demonstrated exceptional compassion, leadership, and a profound commitment to making a positive impact on our community. Their exemplary efforts and best work have significantly contributed to the success of initiative.
              <br/><br/>
              We highly commend their invaluable contribution, passion, and spirit of service.
            </div>
            <div class="cert-meta">
              ID: <span class="highlight">${displayMemberId}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Issued: <span class="highlight">${issueDateStr}</span>
            </div>
            <div class="cert-footer">
              <img src="${qrUrl}" alt="QR" class="qr-img" />
              <div class="sig-box">
                <div class="sig-cursive">Bharat Bhushan</div>
                <div class="sig-title">Managing Director</div>
              </div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [uidNo, setUidNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("Graduate");
  const [specializations, setSpecializations] = useState("");
  const [street, setStreet] = useState("");
  const [villageCity, setVillageCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [agreement, setAgreement] = useState(true);

  // Image Upload Fields (Base64 data or URLs) Max 3MB
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uidFrontDoc, setUidFrontDoc] = useState<string | null>(null);
  const [uidBackDoc, setUidBackDoc] = useState<string | null>(null);

  // File Upload Error Messages
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uidFrontDocError, setUidFrontDocError] = useState<string | null>(null);
  const [uidBackDocError, setUidBackDocError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const res = await fetch("/api/admin/volunteers", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setVolunteers(data.volunteers || []);
      } else {
        throw new Error(data.message || "Failed to fetch volunteers.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while fetching volunteers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Image file reader helper with 3MB Limit (3 * 1024 * 1024 = 3,145,728 bytes)
  const handleImageUpload = (
    file: File,
    setter: (val: string | null) => void,
    errorSetter: (err: string | null) => void
  ) => {
    errorSetter(null);
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB Limit
    if (file.size > maxSizeBytes) {
      errorSetter(`File size exceeds 3MB limit! (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.onerror = () => {
      errorSetter("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  // Calculate age from DOB
  const calculateAge = (dobString: string): number | null => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // DOB Change validation (Age 21 - 65)
  const handleDobChange = (val: string) => {
    setDob(val);
    setDobError(null);
    if (val) {
      const age = calculateAge(val);
      if (age !== null && (age < 21 || age > 65)) {
        setDobError(`Volunteer age must be between 21 and 65 years (Current calculated age: ${age} yrs)`);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFullName("");
    setGender("Male");
    setDob("");
    setUidNo("");
    setEmail("");
    setPhone("");
    setEducation("Graduate");
    setSpecializations("");
    setStreet("");
    setVillageCity("");
    setDistrict("");
    setStateName("");
    setPincode("");
    setAgreement(true);
    setProfilePhoto(null);
    setUidFrontDoc(null);
    setUidBackDoc(null);
    setPhotoError(null);
    setUidFrontDocError(null);
    setUidBackDocError(null);
    setDobError(null);
    setMemberSince("");
    setExpiryDate("");
    setIsEditMode(false);
    setEditVolunteerId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (v: Volunteer) => {
    resetForm();
    setIsEditMode(true);
    setEditVolunteerId(v.id);
    setFullName(v.fullName);
    setGender(v.gender || "Male");
    setDob(v.dob || "");
    setUidNo(v.uidNo || "");
    setEmail(v.email);
    setPhone(v.phone);
    setEducation(v.education || "Graduate");
    setSpecializations(v.specializations || "");
    setStreet(v.street || "");
    setVillageCity(v.villageCity || "");
    setDistrict(v.district || "");
    setStateName(v.state || "");
    setPincode(v.pincode || "");
    setAgreement(v.agreement);
    setProfilePhoto(v.profilePhoto || null);
    setUidFrontDoc(v.uidFrontDoc || null);
    setUidBackDoc(v.uidBackDoc || null);
    setMemberSince(v.memberSince || "");
    setExpiryDate(v.expiryDate || "");
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (v: Volunteer) => {
    setViewVolunteer(v);
    setMemberSince(v.memberSince || "");
    setExpiryDate(v.expiryDate || "");
    setActiveViewTab("details");
  };

  const handleSaveVolunteerDates = async () => {
    if (!viewVolunteer) return;
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setSavingDates(true);
    try {
      const res = await fetch(`/api/admin/volunteers/${viewVolunteer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          memberSince,
          expiryDate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.volunteer) {
        setViewVolunteer(data.volunteer);
        setVolunteers((prev) =>
          prev.map((v) => (v.id === data.volunteer.id ? data.volunteer : v))
        );
        Swal.fire({
          icon: "success",
          title: "Dates Saved!",
          text: "Member Since & Expiry Date updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to update dates.");
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong while saving dates.",
      });
    } finally {
      setSavingDates(false);
    }
  };

  const handleSaveVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all required fields (Full Name, Email, Phone).");
      return;
    }

    if (dobError) {
      setError(dobError);
      return;
    }

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(isEditMode ? "edit" : "create");
    setError(null);
    setSuccessMsg(null);

    const payload = {
      fullName: fullName.trim(),
      gender,
      dob,
      uidNo: uidNo.trim().replace(/\s+/g, ""),
      uidFrontDoc,
      uidBackDoc,
      email: email.trim(),
      phone: phone.trim(),
      education,
      specializations: specializations.trim(),
      street: street.trim(),
      villageCity: villageCity.trim(),
      district: district.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      profilePhoto,
      agreement,
      status: "APPROVED",
      memberSince,
      expiryDate
    };

    try {
      const url = isEditMode ? `/api/admin/volunteers/${editVolunteerId}` : "/api/admin/volunteers";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save volunteer details.");
      }

      setSuccessMsg(isEditMode ? "Volunteer details updated successfully!" : "Volunteer registered successfully!");
      setIsModalOpen(false);
      resetForm();
      fetchVolunteers();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving volunteer.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteVolunteer = async (id: number) => {
    const isDark = typeof document !== "undefined" && document.querySelector(".dark") !== null;

    const result = await Swal.fire({
      title: "Delete Volunteer?",
      text: "Are you sure you want to remove this volunteer from system? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Volunteer",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1e293b",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
      }
    });

    if (!result.isConfirmed) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`delete-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/volunteers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete volunteer.");

      Swal.fire({
        title: "Deleted Successfully!",
        text: "Volunteer record has been removed from the system.",
        icon: "success",
        confirmButtonColor: "#10b981",
        background: isDark ? "#0f172a" : "#ffffff",
        color: isDark ? "#ffffff" : "#1e293b",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
        }
      });

      setSuccessMsg("Volunteer record deleted successfully.");
      fetchVolunteers();
    } catch (err: any) {
      setError(err.message || "Failed to delete volunteer.");
      Swal.fire({
        title: "Deletion Failed",
        text: err.message || "Failed to delete volunteer.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: isDark ? "#0f172a" : "#ffffff",
        color: isDark ? "#ffffff" : "#1e293b",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
        }
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter & Search Volunteers
  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      (v.memberId && v.memberId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery) ||
      (v.uidNo && v.uidNo.includes(searchQuery)) ||
      (v.villageCity && v.villageCity.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.state && v.state.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesEducation = educationFilter === "All" || v.education === educationFilter;
    const matchesGender = genderFilter === "All" || v.gender === genderFilter;

    return matchesSearch && matchesEducation && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Volunteer Directory & Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Register new volunteers, review Aadhaar UID identity documents, and manage active contributors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchVolunteers}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/10 transition transform active:scale-95 cursor-pointer border-none"
          >
            <Plus className="h-4 w-4" />
            Add Volunteer
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p className="flex-1">{successMsg}</p>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Member ID, Name, Phone, Email, UID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Education:</span>
            <select
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="All">All Qualifications</option>
              <option value="Higher Secondary">Higher Secondary</option>
              <option value="Diploma">Diploma</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Ph.D">Ph.D</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Volunteer Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-xs font-bold">Loading Volunteer Directory...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
            <HeartHandshake className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Volunteer Records Found</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              {searchQuery ? "Try adjusting your search query or filters." : "Click 'Add Volunteer' above to register a new volunteer."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Member ID</th>
                  <th className="py-3.5 px-4">Volunteer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">DOB / Age</th>
                  <th className="py-3.5 px-4">Education</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Aadhaar / UID</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredVolunteers.map((v) => {
                  const age = calculateAge(v.dob);
                  const displayMemberId = v.memberId || `FGF-00${v.phone ? v.phone.replace(/\D/g, "").slice(-2) : "00"}26`;
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      {/* Member ID Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-[11px] font-mono font-black text-indigo-700 dark:text-indigo-300 shadow-2xs">
                          <CreditCard className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          {displayMemberId}
                        </span>
                      </td>

                      {/* Volunteer Name & Photo */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 overflow-hidden flex items-center justify-center shrink-0">
                            {v.profilePhoto ? (
                              <img src={v.profilePhoto} alt={v.fullName} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight">
                              {v.fullName}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {v.gender}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200 font-bold">
                          <Mail className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{v.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{v.phone}</span>
                        </div>
                      </td>

                      {/* DOB / Age */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="block font-bold text-slate-800 dark:text-slate-200">
                            {v.dob ? v.dob : "N/A"}
                          </span>
                          {age !== null && (
                            <span className="inline-block bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50 text-[10px] font-black text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                              {age} Years
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Education & Specializations */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200/60 px-2.5 py-0.5 text-[10px] font-extrabold">
                            {v.education}
                          </span>
                          {v.specializations && (
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                              {v.specializations}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 text-xs">
                        <div className="space-y-0.5 text-slate-600 dark:text-slate-400">
                          <span className="block font-bold text-slate-800 dark:text-slate-200">
                            {[v.villageCity, v.district].filter(Boolean).join(", ") || "N/A"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {[v.state, v.pincode].filter(Boolean).join(" - ")}
                          </span>
                        </div>
                      </td>

                      {/* Aadhaar / UID */}
                      <td className="py-4 px-4">
                        {v.uidNo ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                              UID: {v.uidNo}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {v.uidFrontDoc && (
                                <button
                                  onClick={() => setViewDocImage({ title: `Aadhaar Front (${v.uidNo})`, url: v.uidFrontDoc! })}
                                  className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded font-bold hover:bg-blue-100 transition cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="h-2.5 w-2.5" />
                                  Front
                                </button>
                              )}
                              {v.uidBackDoc && (
                                <button
                                  onClick={() => setViewDocImage({ title: `Aadhaar Back (${v.uidNo})`, url: v.uidBackDoc! })}
                                  className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded font-bold hover:bg-indigo-100 transition cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="h-2.5 w-2.5" />
                                  Back
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">UID: N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewVolunteer(v)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="View Full Profile Details"
                          >
                            <Eye className="h-3.5 w-3.5 text-blue-500" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(v)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Edit Volunteer"
                          >
                            <Edit className="h-3.5 w-3.5 text-amber-500" />
                          </button>

                          <button
                            onClick={() => handleDeleteVolunteer(v.id)}
                            disabled={actionLoading === `delete-${v.id}`}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 transition cursor-pointer"
                            title="Delete Volunteer"
                          >
                            {actionLoading === `delete-${v.id}` ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT VOLUNTEER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isEditMode ? "Edit Volunteer Profile" : "Register New Volunteer"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Fill in volunteer credentials, PAN & Aadhaar details and upload documents (Max 3MB per file).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveVolunteer} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Profile Photo Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div className="relative h-24 w-24 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <User className="h-8 w-8 mb-1" />
                      <span className="text-[9px] font-bold uppercase">Take Photo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <label className="block text-xs font-extrabold text-slate-900 dark:text-white">
                    Profile Photo (Max 3MB)
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload passport size photograph or live capture image (JPG/PNG).
                  </p>

                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    <label className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs">
                      <Upload className="h-3.5 w-3.5" />
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], setProfilePhoto, setPhotoError);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={() => setProfilePhoto(null)}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  {photoError && <p className="text-[11px] text-red-500 font-bold">{photoError}</p>}
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <User className="h-4 w-4" /> Personal Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Volunteer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Man / Women (Gender) *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer"
                    >
                      <option value="Male">Male / Man</option>
                      <option value="Female">Female / Woman</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date Of Birth (Age: 21 - 65 Years)
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => handleDobChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer"
                    />
                    {dobError && <p className="text-[10px] text-red-500 font-bold mt-1">{dobError}</p>}
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Education Qualification *
                    </label>
                    <select
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer"
                    >
                      <option value="Higher Secondary">Higher Secondary</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Ph.D">Ph.D</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="volunteer@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Member Since (Start Date) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Member Since (Start Date)
                    </label>
                    <input
                      type="date"
                      value={memberSince}
                      onChange={(e) => setMemberSince(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer"
                    />
                  </div>

                  {/* Expiry Date (Tenure End) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date (Tenure End)
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Specialization / Nature of Work */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specializations (Nature of work)
                  </label>
                  <input
                    type="text"
                    value={specializations}
                    onChange={(e) => setSpecializations(e.target.value)}
                    placeholder="e.g. Digital Literacy, Teaching, Field Operations, Social Counseling..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Aadhaar Identity Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <CreditCard className="h-4 w-4" /> Aadhaar (UID) Verification Documents
                </h4>

                {/* Aadhaar UID Section */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      UID NO. (Only Number 12 Digit)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={uidNo}
                      onChange={(e) => setUidNo(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456789012"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* JPG Front */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        JPG Front Image (Max 3MB)
                      </label>
                      <label className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:border-emerald-500 transition">
                        <span className="text-slate-500 truncate">
                          {uidFrontDoc ? "Front Image Attached ✓" : "Upload Front JPG"}
                        </span>
                        <Upload className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], setUidFrontDoc, setUidFrontDocError);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {uidFrontDocError && <p className="text-[10px] text-red-500 font-bold mt-1">{uidFrontDocError}</p>}
                    </div>

                    {/* JPG Back */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        JPG Back Image (Max 3MB)
                      </label>
                      <label className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:border-emerald-500 transition">
                        <span className="text-slate-500 truncate">
                          {uidBackDoc ? "Back Image Attached ✓" : "Upload Back JPG"}
                        </span>
                        <Upload className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], setUidBackDoc, setUidBackDocError);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {uidBackDocError && <p className="text-[10px] text-red-500 font-bold mt-1">{uidBackDocError}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Permanent Address Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <MapPin className="h-4 w-4" /> Permanent Address
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Street / Line 1
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street / House No."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Village / Town / City
                    </label>
                    <input
                      type="text"
                      value={villageCity}
                      onChange={(e) => setVillageCity(e.target.value)}
                      placeholder="City / Village"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="District"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      placeholder="110001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Voluntary Agreement */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Voluntary Agreement Checkbox (I confirm all information and documents provided are genuine)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading === "create" || actionLoading === "edit"}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/10 transition transform active:scale-95 cursor-pointer border-none"
                >
                  {actionLoading === "create" || actionLoading === "edit" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {isEditMode ? "Update Volunteer" : "Save Volunteer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW FULL DETAILS & CERTIFICATE MODAL */}
      {viewVolunteer && (() => {
        const displayMemberId = viewVolunteer.memberId || `FGF-00${viewVolunteer.phone ? viewVolunteer.phone.replace(/\D/g, "").slice(-2) : "00"}26`;
        const regDate = viewVolunteer.createdAt ? new Date(viewVolunteer.createdAt) : new Date();

        const mSince = memberSince !== undefined && memberSince !== "" ? memberSince : viewVolunteer.memberSince;
        const mExp = expiryDate !== undefined && expiryDate !== "" ? expiryDate : viewVolunteer.expiryDate;

        const defaultStart = new Date(regDate.getFullYear() - 1, regDate.getMonth(), regDate.getDate());
        const defaultEnd = regDate;

        const startDateStr = formatDateSafe(mSince, defaultStart);
        const endDateStr = formatDateSafe(mExp, defaultEnd);

        const issueDateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://flarelapfoundation.org/verify-volunteer?id=${displayMemberId}`)}`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Volunteer Profile & Certificate
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Member ID: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{displayMemberId}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintCertificate(viewVolunteer, memberSince, expiryDate)}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
                    title="Print / Save Certificate as PDF"
                  >
                    <Printer className="h-4 w-4" />
                    <span className="hidden sm:inline">Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setViewVolunteer(null)}
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50 px-6 pt-2 gap-2">
                <button
                  onClick={() => setActiveViewTab("details")}
                  className={`pb-2.5 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeViewTab === "details"
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Overview & Aadhaar Docs
                </button>
                <button
                  onClick={() => setActiveViewTab("certificate")}
                  className={`pb-2.5 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeViewTab === "certificate"
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Award className="h-4 w-4 text-amber-500" />
                  Certificate of Appreciation 🎖️
                </button>
                <button
                  onClick={() => setActiveViewTab("idcard")}
                  className={`pb-2.5 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeViewTab === "idcard"
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-indigo-500" />
                  Official ID Card 🪪
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Member Since & Expiry Date Configuration Box */}
                <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <h4 className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 tracking-wider">
                        Member Since & Expiry Date (Custom Certificate Dates)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveVolunteerDates}
                      disabled={savingDates}
                      className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition transform active:scale-95 cursor-pointer disabled:opacity-50 border-none"
                    >
                      {savingDates ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileCheck className="h-3.5 w-3.5" />}
                      Save Dates
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Member Since (Start Date)
                      </label>
                      <input
                        type="date"
                        value={memberSince}
                        onChange={(e) => setMemberSince(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900/80 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 outline-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Expiry Date (Tenure End)
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900/80 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/30 outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                {activeViewTab === "details" ? (
                  <>
                    {/* Profile Card */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden border-2 border-emerald-500/30 flex items-center justify-center shrink-0">
                        {viewVolunteer.profilePhoto ? (
                          <img src={viewVolunteer.profilePhoto} alt={viewVolunteer.fullName} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white">
                            {viewVolunteer.fullName}
                          </h3>
                          <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[11px] font-mono font-black px-3 py-0.5 rounded-full shadow-xs">
                            <CreditCard className="h-3.5 w-3.5" />
                            {displayMemberId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold mt-1">
                          {viewVolunteer.gender} • DOB: {viewVolunteer.dob || "N/A"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-block bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/50">
                            {viewVolunteer.education}
                          </span>
                          <button
                            onClick={() => setActiveViewTab("certificate")}
                            className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-black px-2.5 py-0.5 rounded-md hover:bg-amber-500/20 transition cursor-pointer"
                          >
                            <Award className="h-3 w-3" /> View Certificate
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Grid Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl border border-indigo-200/70 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-1">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">Official Member ID</span>
                        <p className="font-mono font-black text-sm text-indigo-700 dark:text-indigo-300">
                          {displayMemberId}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Contact Info</span>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{viewVolunteer.email}</p>
                        <p className="font-medium text-slate-600 dark:text-slate-400">{viewVolunteer.phone}</p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Specializations / Nature of Work</span>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{viewVolunteer.specializations || "N/A"}</p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Address</span>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          {[viewVolunteer.street, viewVolunteer.villageCity, viewVolunteer.district, viewVolunteer.state, viewVolunteer.pincode]
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Identity Doc</span>
                        <p className="font-bold text-slate-900 dark:text-slate-100">UID (Aadhaar): {viewVolunteer.uidNo || "N/A"}</p>
                      </div>
                    </div>

                    {/* Document Previews */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Uploaded Aadhaar Document Previews</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {viewVolunteer.uidFrontDoc ? (
                          <div
                            onClick={() => setViewDocImage({ title: "Aadhaar Front", url: viewVolunteer.uidFrontDoc! })}
                            className="border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50 dark:bg-slate-950 text-center cursor-pointer hover:border-emerald-500 transition"
                          >
                            <img src={viewVolunteer.uidFrontDoc} alt="Aadhaar Front" className="h-32 w-full object-cover rounded-lg mb-1.5" />
                            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Aadhaar Front Card</span>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs font-semibold flex items-center justify-center">
                            No Aadhaar Front Image
                          </div>
                        )}

                        {viewVolunteer.uidBackDoc ? (
                          <div
                            onClick={() => setViewDocImage({ title: "Aadhaar Back", url: viewVolunteer.uidBackDoc! })}
                            className="border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50 dark:bg-slate-950 text-center cursor-pointer hover:border-emerald-500 transition"
                          >
                            <img src={viewVolunteer.uidBackDoc} alt="Aadhaar Back" className="h-32 w-full object-cover rounded-lg mb-1.5" />
                            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Aadhaar Back Card</span>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs font-semibold flex items-center justify-center">
                            No Aadhaar Back Image
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : activeViewTab === "certificate" ? (
                  /* CERTIFICATE OF APPRECIATION TAB */
                  <div className="space-y-4">
                    {/* Action Bar */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                          Official Certificate Preview
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Click Print / Download PDF to print or save a vector-quality A4 landscape certificate.
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrintCertificate(viewVolunteer)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/10 transition transform active:scale-95 cursor-pointer"
                      >
                        <Printer className="h-4 w-4" />
                        Print / Save PDF
                      </button>
                    </div>

                    {/* Certificate Outer Frame */}
                    <div className="p-2 bg-slate-900 rounded-2xl shadow-xl border-4 border-slate-900 overflow-x-auto">
                      <div className="min-w-[700px] bg-white text-slate-900 p-2 border-4 border-slate-900 box-border">
                        <div className="border-2 border-slate-800 p-8 sm:p-10 text-center relative font-serif">
                          {/* Header Title */}
                          <h2 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-wider uppercase mb-4 font-serif">
                            FLARELAP GLOBAL FOUNDATION
                          </h2>

                          {/* Center Logo */}
                          <div className="my-3 flex justify-center">
                            <img
                              src="/logo.png"
                              alt="Flarelap Logo"
                              className="h-20 w-20 object-contain rounded-2xl shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>

                          {/* Certificate Title */}
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-widest uppercase my-5 font-serif border-b-2 border-slate-100 pb-2 inline-block px-6">
                            CERTIFICATE OF APPRECIATION
                          </h3>

                          {/* Certificate Body Paragraph */}
                          <div className="text-xs sm:text-sm leading-relaxed text-slate-800 max-w-3xl mx-auto my-6 text-justify sm:text-center font-serif">
                            This certificate is proudly presented to{" "}
                            <span className="text-red-600 font-extrabold underline decoration-red-200">
                              {viewVolunteer.fullName}
                            </span>{" "}
                            in deep gratitude for their outstanding dedication and selfless service as a Volunteer with{" "}
                            <span className="text-red-600 font-extrabold">Flarelap Global Foundation</span> from{" "}
                            <span className="text-red-600 font-extrabold">{startDateStr}</span> to{" "}
                            <span className="text-red-600 font-extrabold">{endDateStr}</span>. During their tenure, they demonstrated exceptional compassion, leadership, and a profound commitment to making a positive impact on our community. Their exemplary efforts and best work have significantly contributed to the success of initiative.
                            <br /><br />
                            We highly commend their invaluable contribution, passion, and spirit of service.
                          </div>

                          {/* ID & Date */}
                          <div className="text-xs sm:text-sm font-bold text-slate-900 my-5 flex items-center justify-center gap-6 font-serif">
                            <span>
                              ID: <span className="text-red-600 font-extrabold font-mono">{displayMemberId}</span>
                            </span>
                            <span>
                              Issued: <span className="text-red-600 font-extrabold">{issueDateStr}</span>
                            </span>
                          </div>

                          {/* Footer Row: QR Code & Signature */}
                          <div className="mt-8 pt-4 border-t border-slate-100 flex items-end justify-between px-4">
                            {/* QR Code */}
                            <div className="flex flex-col items-center">
                              <img
                                src={qrUrl}
                                alt="Verification QR Code"
                                className="h-20 w-20 border border-slate-200 rounded-lg p-1 bg-white shadow-2xs"
                              />
                            </div>

                            {/* Signature Box */}
                            <div className="border-1.5 border-emerald-300 rounded-2xl px-8 py-2.5 bg-slate-50/80 text-center">
                              <p className="font-serif italic text-2xl font-black text-slate-900 tracking-wide">
                                Bharat Bhushan
                              </p>
                              <p className="text-[11px] font-sans font-bold text-slate-800 uppercase tracking-wider mt-0.5">
                                Managing Director
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* OFFICIAL ID CARD TAB */
                  <div className="space-y-6">
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 gap-3">
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-indigo-500" />
                          Official Volunteer ID Badge (Front & Back)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Vector-styled vertical lanyard card badge with official gradient header, QR verification code, & security rules.
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrintIdCard(viewVolunteer, memberSince, expiryDate)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-purple-600/20 transition transform active:scale-95 cursor-pointer border-none"
                      >
                        <Printer className="h-4 w-4" />
                        Print / Save ID Card
                      </button>
                    </div>

                    {/* Live Cards Container */}
                    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
                      {/* FRONT SIDE PREVIEW */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                          Front Side
                        </span>
                        <div className="w-[310px] h-[490px] rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between relative select-none">
                          {/* Header Banner */}
                          <div className="relative h-[95px] w-full overflow-hidden bg-[#0038a8]">
                            {/* Lanyard Hole Cutout */}
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-white/90 border border-slate-400 rounded-full z-10 opacity-90"></div>
                            <img src="/id-banner.jpg" alt="Flarelap Global Foundation Banner" className="w-full h-full object-cover" />
                          </div>
                          <div className="h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400"></div>

                          {/* Card Body */}
                          <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-blue-50/30 via-white to-slate-50">
                            <div className="flex gap-3 items-start">
                              {/* Photo */}
                              <div className="w-[96px] h-[118px] rounded-lg border-2 border-slate-900 overflow-hidden bg-slate-100 shrink-0 shadow-md">
                                {viewVolunteer.profilePhoto ? (
                                  <img src={viewVolunteer.profilePhoto} alt={viewVolunteer.fullName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500">
                                    <User className="h-10 w-10" />
                                  </div>
                                )}
                              </div>
                              {/* Details */}
                              <div className="flex-1 space-y-1 text-left">
                                <div>
                                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">MEMBER ID</span>
                                  <span className="font-mono font-black text-xs text-blue-600">{displayMemberId}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">DESIGNATION</span>
                                  <span className="font-bold text-[10px] text-slate-800">Volunteer Member</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">MEMBER SINCE</span>
                                  <span className="font-bold text-[10px] text-slate-800">{startDateStr}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">EXPIRY DATE</span>
                                  <span className="font-bold text-[10px] text-slate-800">{endDateStr}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-left mt-2">
                              <div className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">
                                {viewVolunteer.fullName}
                              </div>
                              <div className="flex items-end justify-between mt-2">
                                <div>
                                  <div className="font-serif italic text-lg text-slate-900 font-bold">
                                    {viewVolunteer.fullName.split(' ')[0]}
                                  </div>
                                  <div className="text-[7.5px] font-extrabold text-slate-400 uppercase border-t border-slate-300 pt-0.5 w-20">
                                    MEMBER SIGNATURE
                                  </div>
                                </div>
                                <span className="text-[8px] font-black uppercase text-emerald-600 border border-emerald-500 px-1.5 py-0.5 rounded -rotate-6 bg-emerald-50">
                                  ✓ APPROVED
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                              <img src={qrUrl} alt="QR" className="w-12 h-12" />
                              <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-xs tracking-wider">
                                ★ OFFICIAL MEMBER
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-900 text-white text-center py-1.5 text-[7.5px] font-black uppercase tracking-wider">
                            VALIDATED MEMBER ID CARD • WWW.FLARELAPFOUNDATION.ORG
                          </div>
                        </div>
                      </div>

                      {/* BACK SIDE PREVIEW */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                          Back Side
                        </span>
                        <div className="w-[310px] h-[490px] rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between relative select-none">
                          {/* Back Header */}
                          <div className="relative h-[95px] w-full overflow-hidden bg-[#0038a8]">
                            {/* Lanyard Hole Cutout */}
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-white/90 border border-slate-400 rounded-full z-10 opacity-90"></div>
                            <img src="/id-banner.jpg" alt="Flarelap Global Foundation Banner" className="w-full h-full object-cover" />
                          </div>
                          <div className="h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400"></div>

                          {/* Back Content */}
                          <div className="p-3.5 flex-1 flex flex-col justify-between relative bg-white">
                            {/* Hologram strip decoration */}
                            <div className="absolute top-0 left-0 bottom-0 w-3 bg-repeating-linear-gradient(45deg,#cbd5e1,#cbd5e1 4px,#e2e8f0 4px,#e2e8f0 8px) border-r border-slate-200"></div>

                            <div className="pl-3 text-left">
                              <div className="text-[9.5px] font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
                                CARDHOLDER RULES & CONTACT
                              </div>
                              <ul className="text-[8px] text-slate-700 space-y-1.5 font-medium leading-tight">
                                <li>1. THIS CARD IS PROPERTY OF FLARELAP GLOBAL FOUNDATION.</li>
                                <li>2. IT MUST BE PRODUCED UPON REQUEST BY AUTHORIZED PERSONNEL.</li>
                                <li>3. FOUND CARDS SHOULD BE RETURNED TO: GLOBAL HEADQUARTERS, SIRSAL (38) KAITHAL, HARYANA, INDIA. PIN- 136026.</li>
                                <li>4. FOR EMERGENCIES, CONTACT SECURITY: +91 9729817600.</li>
                                <li>5. MISUSE SUBJECT TO DISCIPLINARY ACTION.</li>
                              </ul>

                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center mt-4">
                                <span className="text-[8.5px] font-black text-slate-900">
                                  ISSUE DATE: {startDateStr} &nbsp;|&nbsp; VALID UNTIL: {endDateStr}
                                </span>
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-2">
                                <div>
                                  <div className="font-serif italic text-base font-bold text-slate-900">Bharat Bhushan</div>
                                  <div className="text-[7.5px] font-extrabold text-slate-400 uppercase border-t border-slate-300 pt-0.5 w-24">
                                    AUTHORIZED SIGNATORY
                                  </div>
                                </div>
                                <img src={qrUrl} alt="QR" className="w-10 h-10" />
                              </div>
                            </div>

                            <div className="bg-slate-900 text-white text-center py-1.5 text-[7.5px] font-black uppercase tracking-wider -mx-3.5 -mb-3.5">
                              FOUNDATION HEADQUARTERS • KAITHAL, HARYANA, INDIA
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* VIEW ENLARGED DOCUMENT IMAGE MODAL */}
      {viewDocImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-black text-white">{viewDocImage.title}</h4>
              <button
                onClick={() => setViewDocImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl bg-black">
              <img src={viewDocImage.url} alt={viewDocImage.title} className="max-h-[75vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
