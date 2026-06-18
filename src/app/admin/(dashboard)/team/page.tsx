"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Loader2, Save, X, Image as ImageIcon } from "lucide-react";

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
                <p className="mt-2 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">{member.description}</p>
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
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Role *</label>
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
