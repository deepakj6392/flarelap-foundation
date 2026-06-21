"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { 
  Upload, 
  Link as LinkIcon, 
  Trash2, 
  Loader2, 
  Plus, 
  AlertCircle, 
  CheckCircle,
  FileImage,
  RefreshCw
} from "lucide-react";

interface GalleryImage {
  id: number;
  imageUrl: string;
  caption: string;
  pageName: string;
  sequence: number;
  createdAt: string;
}

export default function GalleryManagerPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [uploadOption, setUploadOption] = useState<"file" | "url">("file");
  const [caption, setCaption] = useState("");
  const [pageName, setPageName] = useState("General");
  const [sequence, setSequence] = useState("0");
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (res.ok) {
        setImages(data.images || []);
      } else {
        throw new Error(data.message || "Failed to load gallery images.");
      }
    } catch (err: any) {
      setError("Failed to fetch gallery images from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary loader/status on UI while converting
    setPreviewUrl(null);
    setSelectedFile(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Max width boundary to optimize size further (e.g., 1200px)
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert canvas image to WebP client-side at 80% quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const filename = `${file.name.replace(/\.[^/.]+$/, "")}.webp`;
              const webpFile = new File([blob], filename, {
                type: "image/webp",
                lastModified: Date.now(),
              });
              setSelectedFile(webpFile);
              setPreviewUrl(URL.createObjectURL(webpFile));
            }
          },
          "image/webp",
          0.8
        );
      };
    };
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (uploadOption === "file" && !selectedFile) {
      setError("Please select a local image file first.");
      return;
    }

    if (uploadOption === "url" && !externalUrl) {
      setError("Please enter an external image URL.");
      return;
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("pageName", pageName);
      formData.append("sequence", sequence);
      
      if (uploadOption === "file" && selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("externalUrl", externalUrl);
      }

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setSuccessMsg("Gallery image successfully added!");
      setCaption("");
      setPageName("General");
      setSequence("0");
      setExternalUrl("");
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchImages(); // Refresh lists
    } catch (err: any) {
      setError(err.message || "Failed to add image. Verify format and connection.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image from the gallery?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#4f46e5", // Indigo theme button color
      cancelButtonColor: "#64748b",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1e293b",
    });

    if (!result.isConfirmed) return;

    setActionLoading(id);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete image.");
      }

      setImages(prev => prev.filter(img => img.id !== id));
      setSuccessMsg("Image deleted successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to delete image.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Status Banners */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {/* Grid: Upload Widget & Media Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Add Image Form */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b pb-3">
              Add New Gallery Image
            </h3>
          </div>

          {/* Option Selector Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200/50 dark:border-slate-850 max-w-sm">
            <button
              type="button"
              onClick={() => setUploadOption("file")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-black transition cursor-pointer ${
                uploadOption === "file"
                  ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-450 shadow-xs"
                  : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-350"
              }`}
            >
              <Upload className="h-4 w-4" />
              Local File Upload
            </button>
            <button
              type="button"
              onClick={() => setUploadOption("url")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-black transition cursor-pointer ${
                uploadOption === "url"
                  ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-450 shadow-xs"
                  : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-350"
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              External Image URL
            </button>
          </div>

          {/* Image Upload Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Option A: Local file upload */}
            {uploadOption === "file" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-450 uppercase tracking-wider">
                  Select Local Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Custom upload area */}
                  <label className="w-full sm:flex-1 h-32 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/70 hover:border-emerald-500/40 transition cursor-pointer relative overflow-hidden group">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <div className="flex flex-col items-center gap-1.5 text-center p-4">
                      <FileImage className="h-7 w-7 text-slate-400 group-hover:text-emerald-555" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {selectedFile ? selectedFile.name : "Click to select local image"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {selectedFile ? "Pre-converted to WebP" : "PNG, JPG, JPEG, or WebP"}
                      </p>
                    </div>
                  </label>

                  {/* Client side Preview Area */}
                  {previewUrl && (
                    <div className="relative h-32 w-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 flex-shrink-0">
                      <Image 
                        src={previewUrl} 
                        alt="WebP Client preview" 
                        fill 
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 right-1 rounded-md bg-emerald-600/90 text-white text-[8px] font-black px-1.5 py-0.5 tracking-wider uppercase shadow-xs">
                        WebP 80%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Option B: External URL link */}
            {uploadOption === "url" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-450 uppercase tracking-wider">
                  External Image URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <LinkIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 outline-none text-xs font-semibold focus:border-emerald-600 dark:focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Caption Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-655 dark:text-slate-450 uppercase tracking-wider">
                Image Caption / Description (Optional)
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="Enter a brief caption for this image..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 outline-none text-xs font-semibold focus:border-emerald-600 dark:focus:border-emerald-500 transition"
              />
            </div>

            {/* Page and Sequence Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-450 uppercase tracking-wider">
                  Target Page
                </label>
                <select
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 outline-none text-xs font-semibold focus:border-emerald-600 dark:focus:border-emerald-500 transition appearance-none"
                >
                  <option value="General">General (Any)</option>
                  <option value="donate">Donate Page</option>
                  <option value="home">Home Page</option>
                  <option value="about">About Us</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-450 uppercase tracking-wider">
                  Display Sequence
                </label>
                <input
                  type="number"
                  min="0"
                  value={sequence}
                  onChange={(e) => setSequence(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 outline-none text-xs font-semibold focus:border-emerald-600 dark:focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/10 transition disabled:opacity-50 cursor-pointer"
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading image...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Save to Gallery
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Column: Gallery Quick Stats */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b pb-3">
              Media Overview
            </h3>
            <div className="space-y-4 py-2">
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Active Files</p>
                <p className="text-3xl font-black text-emerald-700 mt-1">{images.length}</p>
              </div>
              <div className="text-xs font-semibold text-slate-550 dark:text-slate-400 space-y-2.5">
                <div className="flex justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800/80">
                  <span>Local uploads (.webp)</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {images.filter(img => img.imageUrl.startsWith("/uploads/")).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hotlinked URL images</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {images.filter(img => !img.imageUrl.startsWith("/uploads/")).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-400 border-t pt-4 border-slate-100 dark:border-slate-800/80 font-bold leading-relaxed">
            All local image uploads are compressed and converted into high-efficiency `.webp` formats client-side to save disk resources and load instantly.
          </div>
        </div>
      </div>

      {/* Gallery List Grid View */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b pb-3">
            Moments Showcase List
          </h3>
        </div>

        {loading ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-550" />
            <p className="text-xs font-semibold text-slate-505">Loading media showcase...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center text-center p-8">
            <FileImage className="h-10 w-10 text-slate-350 dark:text-slate-600 mb-2.5" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Showcase Gallery is Empty</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 font-semibold leading-relaxed">
              Upload local image captures or paste external links to display them inside the homepage carousel.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map(img => (
              <div 
                key={img.id}
                className="group border rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs transition hover:border-emerald-500/20"
              >
                {/* Media Preview window */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/40">
                  <Image 
                    src={img.imageUrl} 
                    alt={img.caption || "Gallery item"} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {img.imageUrl.startsWith("/uploads/") ? (
                      <span className="rounded bg-indigo-600/90 text-[8px] font-black text-white px-1.5 py-0.5 uppercase tracking-wide">
                        webp
                      </span>
                    ) : (
                      <span className="rounded bg-purple-650/90 text-[8px] font-black text-white px-1.5 py-0.5 uppercase tracking-wide">
                        link
                      </span>
                    )}
                  </div>
                </div>

                {/* Caption details & Delete controls */}
                <div className="p-3.5 space-y-3">
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-normal truncate" title={img.caption || ""}>
                    {img.caption || <span className="text-slate-400 italic">No description</span>}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                    Page: {img.pageName} | Seq: {img.sequence}
                  </p>
                  <div className="flex items-center justify-between border-t pt-2.5 border-slate-100 dark:border-slate-800/80">
                    <span className="text-[9px] font-bold text-slate-400">
                      ID: {img.id} • {new Date(img.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      disabled={actionLoading === img.id}
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1 rounded-md text-slate-455 hover:text-red-500 transition disabled:opacity-40"
                    >
                      {actionLoading === img.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
