"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Clock, 
  ChevronRight, 
  X,
  Loader2
} from "lucide-react";
import Swal from "sweetalert2";
import { useDashboard } from "../layout";
import { STUDY_MATERIALS, StudyMaterial } from "../data";

export default function StudyMaterialsPage() {
  const { student, isDark, saveActivity } = useDashboard();

  const [selectedNote, setSelectedNote] = useState<StudyMaterial | null>(null);
  const [readLessons, setReadLessons] = useState<number[]>([]);

  // Load lesson status on mount/student change
  useEffect(() => {
    if (student) {
      const stored = localStorage.getItem(`student_read_lessons_${student.student_id}`);
      if (stored) {
        try {
          setReadLessons(JSON.parse(stored));
        } catch {
          setReadLessons([]);
        }
      }
    }
  }, [student]);

  if (!student) return null;

  const enrolledCourseId = Number(student.course_id);
  const filteredMaterials = STUDY_MATERIALS.filter(
    (material) => material.courseId === enrolledCourseId
  );

  const handleMarkAsRead = (lessonId: number) => {
    if (!readLessons.includes(lessonId)) {
      const updated = [...readLessons, lessonId];
      setReadLessons(updated);
      localStorage.setItem(`student_read_lessons_${student.student_id}`, JSON.stringify(updated));
      
      saveActivity({
        id: Date.now(),
        type: "lesson",
        title: `Read Lesson: ${STUDY_MATERIALS.find(m => m.id === lessonId)?.title || "Lesson"}`
      });
    }
  };

  const textHeading = isDark ? "text-white" : "text-slate-900";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className={`text-lg font-black ${textHeading}`}>Study Course Materials</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Read specialized study notes compiled by foundation mentors.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {filteredMaterials.length === 0 ? (
          <div className={`col-span-2 rounded-2xl border p-8 text-center ${isDark ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-white shadow-xs"}`}>
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className={`text-sm font-black ${textHeading}`}>No Study Materials Available</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              There are currently no study notes uploaded for your course. Please check back later.
            </p>
          </div>
        ) : (
          filteredMaterials.map(note => (
            <div 
              key={note.id} 
              onClick={() => setSelectedNote(note)}
              className={`group border rounded-2xl p-5.5 flex flex-col justify-between transition duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                isDark 
                  ? "border-slate-805 bg-slate-900/30 hover:border-emerald-500/30 hover:bg-slate-900/50" 
                  : "border-slate-200 bg-white hover:border-emerald-650/40 shadow-xs"
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wide">
                    {note.subject}
                  </span>
                  {readLessons.includes(note.id) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black text-emerald-600 uppercase border border-emerald-500/20">
                      Read ✓
                    </span>
                  )}
                </div>
                <h3 className={`text-sm font-black group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug ${textHeading}`}>
                  {note.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold line-clamp-3">
                  {note.content}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {note.readTime}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                  Read Lesson <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* STUDY NOTE DETAIL DRAWER MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative space-y-4 ${
            isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
          }`}>
            <button 
              onClick={() => setSelectedNote(null)} 
              className={`absolute top-4 right-4 rounded-lg p-1.5 transition cursor-pointer ${
                isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 text-left">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wide">
                {selectedNote.subject}
              </span>
              <h3 className={`text-sm font-black tracking-tight leading-snug ${textHeading}`}>
                {selectedNote.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-350" />
                {selectedNote.readTime}
              </p>
            </div>

            <hr className={isDark ? "border-slate-800" : "border-slate-100"} />

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold text-left select-text max-h-[300px] overflow-y-auto pr-2">
              {selectedNote.content}
            </p>

            <div className="pt-2 flex justify-between items-center">
              <div>
                {!readLessons.includes(selectedNote.id) ? (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedNote.id);
                      Swal.fire({
                        title: "Lesson Completed!",
                        text: `"${selectedNote.title}" has been marked as read.`,
                        icon: "success",
                        confirmButtonColor: "#4f46e5"
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition cursor-pointer"
                  >
                    Mark as Read ✓
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
                    Completed ✓
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition cursor-pointer ${
                  isDark ? "bg-slate-800 text-white hover:bg-slate-750" : "bg-slate-900 text-white hover:bg-slate-850"
                }`}
              >
                Close Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
