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
  RefreshCw
} from "lucide-react";

interface Volunteer {
  id: number;
  profilePhoto?: string | null;
  fullName: string;
  gender: string;
  dob: string;
  panNo?: string | null;
  panCardDoc?: string | null;
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
  const [viewDocImage, setViewDocImage] = useState<{ title: string; url: string } | null>(null);

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [panNo, setPanNo] = useState("");
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
  const [panCardDoc, setPanCardDoc] = useState<string | null>(null);
  const [uidFrontDoc, setUidFrontDoc] = useState<string | null>(null);
  const [uidBackDoc, setUidBackDoc] = useState<string | null>(null);

  // File Upload Error Messages
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [panDocError, setPanDocError] = useState<string | null>(null);
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
    setPanNo("");
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
    setPanCardDoc(null);
    setUidFrontDoc(null);
    setUidBackDoc(null);
    setPhotoError(null);
    setPanDocError(null);
    setUidFrontDocError(null);
    setUidBackDocError(null);
    setDobError(null);
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
    setPanNo(v.panNo || "");
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
    setPanCardDoc(v.panCardDoc || null);
    setUidFrontDoc(v.uidFrontDoc || null);
    setUidBackDoc(v.uidBackDoc || null);
    setIsModalOpen(true);
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
      panNo: panNo.trim().toUpperCase(),
      panCardDoc,
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
      status: "APPROVED"
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
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery) ||
      (v.panNo && v.panNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
              Register new volunteers, review PAN & Aadhaar identity documents, and manage active contributors.
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
            placeholder="Search by name, phone, email, PAN, UID..."
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
                  <th className="py-3.5 px-4">Volunteer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">DOB / Age</th>
                  <th className="py-3.5 px-4">Education</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Identity Docs</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredVolunteers.map((v) => {
                  const age = calculateAge(v.dob);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
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

                      {/* Identity Docs */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          {v.panNo ? (
                            <button
                              onClick={() => {
                                if (v.panCardDoc) {
                                  setViewDocImage({ title: `PAN Card: ${v.panNo}`, url: v.panCardDoc });
                                }
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border text-left flex items-center justify-between gap-1 transition ${
                                v.panCardDoc 
                                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 hover:underline cursor-pointer"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200"
                              }`}
                            >
                              <span>PAN: {v.panNo}</span>
                              {v.panCardDoc && <Eye className="h-3 w-3 text-emerald-600 shrink-0" />}
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">PAN: N/A</span>
                          )}

                          {v.uidNo ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                UID: {v.uidNo}
                              </span>
                              {v.uidFrontDoc && (
                                <button
                                  onClick={() => setViewDocImage({ title: `Aadhaar Front (${v.uidNo})`, url: v.uidFrontDoc! })}
                                  className="text-[9px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded font-bold hover:bg-blue-100 transition cursor-pointer"
                                >
                                  Front
                                </button>
                              )}
                              {v.uidBackDoc && (
                                <button
                                  onClick={() => setViewDocImage({ title: `Aadhaar Back (${v.uidNo})`, url: v.uidBackDoc! })}
                                  className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-1.5 py-0.5 rounded font-bold hover:bg-indigo-100 transition cursor-pointer"
                                >
                                  Back
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">UID: N/A</span>
                          )}
                        </div>
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

              {/* PAN & Aadhaar Identity Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <CreditCard className="h-4 w-4" /> Identity & Verification Documents
                </h4>

                {/* PAN NO Section */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        PAN NO. (Letter & Number)
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={panNo}
                        onChange={(e) => setPanNo(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        PAN Card Document Image (JPG/PNG, Max 3MB)
                      </label>
                      <label className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:border-emerald-500 transition">
                        <span className="text-slate-500 truncate">
                          {panCardDoc ? "PAN Document Attached ✓" : "Upload JPG"}
                        </span>
                        <Upload className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], setPanCardDoc, setPanDocError);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {panDocError && <p className="text-[10px] text-red-500 font-bold mt-1">{panDocError}</p>}
                    </div>
                  </div>
                </div>

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

      {/* VIEW FULL DETAILS MODAL */}
      {viewVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-emerald-500" />
                Volunteer Profile Details
              </h3>
              <button
                onClick={() => setViewVolunteer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden border-2 border-emerald-500/30 flex items-center justify-center shrink-0">
                  {viewVolunteer.profilePhoto ? (
                    <img src={viewVolunteer.profilePhoto} alt={viewVolunteer.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {viewVolunteer.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    {viewVolunteer.gender} • DOB: {viewVolunteer.dob || "N/A"}
                  </p>
                  <span className="inline-block mt-1 bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-purple-200/60">
                    {viewVolunteer.education}
                  </span>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Identity Docs</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">PAN: {viewVolunteer.panNo || "N/A"}</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100">UID (Aadhaar): {viewVolunteer.uidNo || "N/A"}</p>
                </div>
              </div>

              {/* Document Previews */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Uploaded Document Previews</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {viewVolunteer.panCardDoc ? (
                    <div
                      onClick={() => setViewDocImage({ title: "PAN Card", url: viewVolunteer.panCardDoc! })}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 text-center cursor-pointer hover:border-emerald-500 transition"
                    >
                      <img src={viewVolunteer.panCardDoc} alt="PAN Card" className="h-24 w-full object-cover rounded-lg mb-1" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">PAN Card</span>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-[10px] flex items-center justify-center">
                      No PAN Image
                    </div>
                  )}

                  {viewVolunteer.uidFrontDoc ? (
                    <div
                      onClick={() => setViewDocImage({ title: "Aadhaar Front", url: viewVolunteer.uidFrontDoc! })}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 text-center cursor-pointer hover:border-emerald-500 transition"
                    >
                      <img src={viewVolunteer.uidFrontDoc} alt="Aadhaar Front" className="h-24 w-full object-cover rounded-lg mb-1" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Aadhaar Front</span>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-[10px] flex items-center justify-center">
                      No Aadhaar Front
                    </div>
                  )}

                  {viewVolunteer.uidBackDoc ? (
                    <div
                      onClick={() => setViewDocImage({ title: "Aadhaar Back", url: viewVolunteer.uidBackDoc! })}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 text-center cursor-pointer hover:border-emerald-500 transition"
                    >
                      <img src={viewVolunteer.uidBackDoc} alt="Aadhaar Back" className="h-24 w-full object-cover rounded-lg mb-1" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Aadhaar Back</span>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-[10px] flex items-center justify-center">
                      No Aadhaar Back
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
