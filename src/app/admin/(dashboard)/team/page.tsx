"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Loader2, Save, X, Image as ImageIcon } from "lucide-react";

// SVG Icons for social links in admin dashboard
const FacebookIcon = ({ className, title }: { className?: string; title?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		{title && <title>{title}</title>}
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
	</svg>
);

const TwitterIcon = ({ className, title }: { className?: string; title?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		{title && <title>{title}</title>}
		<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
	</svg>
);

const GithubIcon = ({ className, title }: { className?: string; title?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		{title && <title>{title}</title>}
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
		<path d="M9 18c-4.51 2-5-2-7-2"></path>
	</svg>
);

const LinkedinIcon = ({ className, title }: { className?: string; title?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		{title && <title>{title}</title>}
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
		<rect x="2" y="9" width="4" height="12"></rect>
		<circle cx="4" cy="4" r="2"></circle>
	</svg>
);

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string | null;
  imageUrl: string;
  facebook: string | null;
  twitter: string | null;
  github: string | null;
  behance: string | null;
  order: number;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [behance, setBehance] = useState("");
  const [order, setOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch team members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers();
  }, []);

  const resetForm = () => {
    setName("");
    setRole("");
    setDescription("");
    setFacebook("");
    setTwitter("");
    setGithub("");
    setBehance("");
    setOrder("0");
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    resetForm();
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setDescription(member.description || "");
    setFacebook(member.facebook || "");
    setTwitter(member.twitter || "");
    setGithub(member.github || "");
    setBehance(member.behance || "");
    setOrder(member.order.toString());
    setImagePreview(member.imageUrl);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) {
      alert("Name and Role are required.");
      return;
    }
    if (!editingId && !imageFile) {
      alert("Image is required when creating a new member.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      formData.append("description", description);
      formData.append("facebook", facebook);
      formData.append("twitter", twitter);
      formData.append("github", github);
      formData.append("behance", behance);
      formData.append("order", order);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = editingId ? `/api/team/${editingId}` : "/api/team";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchMembers();
      } else {
        alert("Failed to delete member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage the leadership and team displayed on the About page.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <div key={member.id} className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <div className="absolute right-2 top-2 flex gap-2 z-10">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="rounded-full bg-white/90 p-1.5 text-blue-600 shadow-sm hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="rounded-full bg-white/90 p-1.5 text-red-600 shadow-sm hover:bg-red-50 dark:bg-slate-800 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mb-4 flex justify-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-slate-50 dark:border-slate-800">
                  <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{member.role}</p>
                <p className="mt-2 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">{member.description || "No description provided."}</p>
                
                {/* Social Links Configured Indicators */}
                <div className="mt-4 flex justify-center gap-3 border-t border-slate-50 dark:border-slate-800 pt-3">
                  {member.facebook ? (
                    <FacebookIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" title={`Facebook: ${member.facebook}`} />
                  ) : (
                    <FacebookIcon className="h-4 w-4 text-slate-300 dark:text-slate-700" title="Facebook not configured" />
                  )}
                  {member.twitter ? (
                    <TwitterIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" title={`Twitter: ${member.twitter}`} />
                  ) : (
                    <TwitterIcon className="h-4 w-4 text-slate-300 dark:text-slate-700" title="Twitter not configured" />
                  )}
                  {member.behance ? (
                    <LinkedinIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" title={`LinkedIn: ${member.behance}`} />
                  ) : (
                    <LinkedinIcon className="h-4 w-4 text-slate-300 dark:text-slate-700" title="LinkedIn not configured" />
                  )}
                  {member.github ? (
                    <GithubIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" title={`GitHub: ${member.github}`} />
                  ) : (
                    <GithubIcon className="h-4 w-4 text-slate-300 dark:text-slate-700" title="GitHub not configured" />
                  )}
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">No team members found. Click &apos;Add Member&apos; to create one.</p>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-slate-900 flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Profile Image <span className="text-slate-400 font-normal">(Will be converted to WebP)</span>
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        {imagePreview ? "Change Image" : "Select Image"}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Post (Role) *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white resize-none"
                    placeholder="Write a short description about this team member..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="e.g., 1 (first), 2 (second)"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">LinkedIn URL</label>
                  <input
                    type="url"
                    value={behance}
                    onChange={(e) => setBehance(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Facebook URL</label>
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Twitter/X URL</label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="https://x.com/username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
