"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  BookOpen, 
  Trash2, 
  RefreshCw, 
  Search, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  X,
  Pencil
} from "lucide-react";

interface CategoryRecord {
  id: number;
  name: string;
  createdAt: string;
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      } else {
        throw new Error(data.message || "Failed to load categories.");
      }
    } catch (err: any) {
      setError("Failed to fetch category records. Verify database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(isEditMode ? "edit" : "create");
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      let res;
      if (isEditMode) {
        res = await fetch(`${apiUrl}/api/admin/categories/${editCategoryId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}` 
          },
          body: JSON.stringify({ name: newCategoryName }),
        });
      } else {
        res = await fetch(`${apiUrl}/api/admin/categories`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}` 
          },
          body: JSON.stringify({ name: newCategoryName }),
        });
      }

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(isEditMode ? "Category updated successfully!" : "Category created successfully!");
        setNewCategoryName("");
        setIsModalOpen(false);
        fetchCategories();
        
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: data.message || "Operation completed successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to save category.");
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete category "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`delete-${id}`);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories();
      } else {
        throw new Error(data.message || "Failed to delete category.");
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: err.message || "Something went wrong.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditCategoryId(null);
    setNewCategoryName("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setIsEditMode(true);
    setEditCategoryId(cat.id);
    setNewCategoryName(cat.name);
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-1">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Mock Test Categories</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Configure exam categories to show up in the Student Registration portal.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/15 hover:shadow-emerald-700/25 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/85 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50 dark:bg-slate-900/10">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search category name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <button
            onClick={fetchCategories}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {/* Display Status */}
        {error && (
          <div className="m-5 flex items-center gap-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-4 text-xs font-semibold text-red-650 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Categories Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
              <p className="text-xs text-slate-500 font-bold">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20 space-y-2">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No categories found</p>
              <p className="text-xs text-slate-400">Create a new category or try adjusting your search filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20 dark:bg-slate-900/5">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-650 dark:text-slate-350">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-400">#{cat.id}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{cat.name}</td>
                    <td className="p-4 text-slate-500 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-950 transition"
                          title="Edit Category"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          disabled={actionLoading === `delete-${cat.id}`}
                          className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-red-650 hover:border-red-200 dark:hover:border-red-950 transition disabled:opacity-50"
                          title="Delete Category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3.5">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-2.5 text-emerald-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isEditMode ? "Edit Mock Test Category" : "Add Mock Test Category"}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Provide unique name for category.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PG Entrance Exam"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "create" || actionLoading === "edit"}
                  className="rounded-xl bg-slate-900 dark:bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 hover:shadow-lg transition disabled:opacity-50"
                >
                  {actionLoading === "create" || actionLoading === "edit" ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
