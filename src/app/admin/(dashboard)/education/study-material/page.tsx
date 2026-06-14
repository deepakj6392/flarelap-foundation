"use client";

import { BookOpen, Plus, Search } from "lucide-react";

export default function StudyMaterialPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Study Materials</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage and publish study documents, textbooks, and notes for student access.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10">
          <Plus className="h-4 w-4" />
          Upload Material
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            0 Materials Available
          </div>
          
          <div className="relative w-full max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search materials..."
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 pl-10 pr-4 text-xs outline-none"
              disabled
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-slate-400 dark:text-slate-500">
          <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Study Materials Uploaded</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm font-medium">Upload study guides, PDF textbooks, or reading sheets for foundation participants.</p>
        </div>
      </div>
    </div>
  );
}
