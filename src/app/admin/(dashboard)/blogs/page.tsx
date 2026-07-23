"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Trash2, Edit2, Loader2, Save, X, Image as ImageIcon, Eye, FileText, Globe } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  excerpt: string;
  metaTitle: string | null;
  metaDesc: string | null;
  keywords: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // UI Tabs inside form modal
  const [formTab, setFormTab] = useState<"write" | "preview" | "seo">("write");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs?admin=true", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-") // collapse multiple hyphens
        .trim();
      setSlug(generatedSlug);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setMetaTitle("");
    setMetaDesc("");
    setKeywords("");
    setPublished(true);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setFormTab("write");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    resetForm();
    setEditingId(blog.id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setMetaTitle(blog.metaTitle || "");
    setMetaDesc(blog.metaDesc || "");
    setKeywords(blog.keywords || "");
    setPublished(blog.published);
    setImagePreview(blog.thumbnail);
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
    if (!title || !slug || !content || !excerpt) {
      alert("Title, Slug, Excerpt, and Content are required.");
      return;
    }
    if (!editingId && !imageFile) {
      alert("Thumbnail image is required for a new blog post.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDesc", metaDesc);
      formData.append("keywords", keywords);
      formData.append("published", published ? "true" : "false");
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save blog post");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog: BlogPost) => {
    const isDark = typeof document !== "undefined" && document.querySelector(".dark") !== null;

    const result = await Swal.fire({
      title: "Delete Blog Post?",
      text: `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Blog",
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

    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        Swal.fire({
          title: "Deleted!",
          text: "Blog post has been removed.",
          icon: "success",
          confirmButtonColor: "#10b981",
          background: isDark ? "#0f172a" : "#ffffff",
          color: isDark ? "#ffffff" : "#1e293b",
        });
        fetchBlogs();
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete blog post.",
          icon: "error",
          confirmButtonColor: "#ef4444",
          background: isDark ? "#0f172a" : "#ffffff",
          color: isDark ? "#ffffff" : "#1e293b",
        });
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Write, edit, and optimize your blog posts for maximum outreach and SEO impact.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Create Blog
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 mb-4">
                  <Image src={blog.thumbnail} alt={blog.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    blog.published 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-250 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border-emerald-900" 
                      : "bg-slate-100 text-slate-650 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                  }`}>
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>
                
                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors" title={blog.title}>
                  {blog.title}
                </h3>
                <p className="text-slate-450 text-[11px] font-semibold tracking-wide dark:text-slate-500 mt-1 block truncate">
                  /{blog.slug}
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-450 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-50 dark:border-slate-800/80 pt-3.5 flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    className="rounded-lg border border-slate-100 p-2 text-blue-600 hover:bg-blue-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800"
                    title="Edit Post"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog)}
                    className="rounded-lg border border-slate-100 p-2 text-red-600 hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-slate-800"
                    title="Delete Post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No blog posts found. Click &apos;Create Blog&apos; to write your first story.</p>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl dark:bg-slate-900 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit Blog Post" : "Write Blog Post"}
                </h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Fill in the fields below. Content supports HTML tags.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-650 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-950/20">
              <button
                type="button"
                onClick={() => setFormTab("write")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all outline-none ${
                  formTab === "write" 
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-450" 
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Write & Content
              </button>
              <button
                type="button"
                onClick={() => setFormTab("preview")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all outline-none ${
                  formTab === "preview" 
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-450" 
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview Output
              </button>
              <button
                type="button"
                onClick={() => setFormTab("seo")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all outline-none ${
                  formTab === "seo" 
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-450" 
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                SEO Settings
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              
              {/* Tab 1: Write Content */}
              {formTab === "write" && (
                <div className="space-y-6">
                  {/* Thumbnail Image */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-350">
                      Thumbnail Cover * <span className="text-slate-400 font-normal">(800x450 recommended, will save as WebP)</span>
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-850">
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div>
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
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-750 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          {imagePreview ? "Change Thumbnail" : "Select Thumbnail"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Blog Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        placeholder="e.g., Transforming Communities with Literacy"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        placeholder="transforming-communities-with-literacy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Short Excerpt (Teaser Description) *</label>
                    <textarea
                      rows={2}
                      required
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white resize-none"
                      placeholder="Write a 1-2 sentence preview description to display in list grids..."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-300">Blog Content (supports &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, etc.) *</label>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded dark:bg-emerald-950/40 dark:text-emerald-450">HTML Mode</span>
                    </div>
                    <textarea
                      rows={10}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-mono transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="<h2>Section Title</h2><p>Start writing your blog content here...</p>"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4">
                    <input
                      type="checkbox"
                      id="published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 outline-none"
                    />
                    <div>
                      <label htmlFor="published" className="block text-sm font-bold text-slate-800 dark:text-slate-250 cursor-pointer">Publish Post immediately</label>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">If unchecked, this post will be saved as a draft and hidden from the public blogs page.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: HTML Live Preview */}
              {formTab === "preview" && (
                <div className="space-y-6">
                  <div className="bg-amber-50/55 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/60 rounded-xl p-4 text-[11px] text-amber-800 dark:text-amber-450 font-medium">
                    This is an approximate visual representation of how this blog post will look inside the public detail page. Ensure your headings, lists, and paragraphs are formatted correctly.
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-950 max-h-[50vh] overflow-y-auto font-sans">
                    <h1 className="text-3xl font-black text-slate-950 dark:text-white mb-2 leading-tight">
                      {title || "Untitled Blog Post"}
                    </h1>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-semibold uppercase tracking-wider">
                      Preview Date • Written by Flarelap Global Foundation
                    </p>

                    {imagePreview && (
                      <div className="relative h-64 md:h-80 w-full mb-8 overflow-hidden rounded-2xl">
                        <img src={imagePreview} alt="Blog preview" className="object-cover w-full h-full" />
                      </div>
                    )}

                    <div className="prose prose-slate max-w-none dark:prose-invert text-slate-850 dark:text-slate-300 text-sm md:text-base leading-relaxed space-y-4">
                      {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                      ) : (
                        <p className="text-slate-450 italic">No content written yet. Go back to the 'Write' tab to add body content.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: SEO Configuration */}
              {formTab === "seo" && (
                <div className="space-y-6">
                  <div className="bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-4 text-[11px] text-emerald-800 dark:text-emerald-450 font-medium">
                    Adding proper metadata helps search engines index your blog posts higher on results pages. Include keywords relevant to the article content.
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Empowering Rural Communities | Flarelap Global Foundation"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Recommended length: 50-60 characters. Fallbacks to blog title if left empty.</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Meta Description</label>
                    <textarea
                      rows={3}
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white resize-none"
                      placeholder="A short SEO teaser to display under links in Google search results..."
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Recommended length: 150-160 characters. Fallbacks to excerpt if left empty.</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-300">Keywords (Comma-separated)</label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="rural education, children books, volunteer mentors, non profit India"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Separate keywords with commas. Example: nutrition, rural health, volunteer program.</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-650 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
