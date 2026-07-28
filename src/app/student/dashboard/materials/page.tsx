"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Clock, 
  ChevronRight, 
  X,
  Search,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Bookmark
} from "lucide-react";
import Swal from "sweetalert2";
import { useDashboard } from "../layout";
import { STUDY_MATERIALS, StudyMaterial } from "../data";

export default function StudyMaterialsPage() {
  const { student, isDark, saveActivity } = useDashboard();

  const [selectedNote, setSelectedNote] = useState<StudyMaterial | null>(null);
  const [readLessons, setReadLessons] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("MY_CATEGORY");

  // Load lesson read status on mount/student change
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

  const studentCourseName = student.course_name || "";
  const studentCategoryName = student.category_name || "";
  const studentCourseId = student.course_id;
  const studentCategoryId = student.category_id;

  // Function to check if a study material matches the student's category / course
  const matchesStudentCategory = (material: StudyMaterial) => {
    // 1. Direct course ID match
    if (studentCourseId && (material.courseId === Number(studentCourseId) || material.courseId === studentCourseId)) {
      return true;
    }
    // 2. Direct category ID match
    if (studentCategoryId && (material.categoryId === Number(studentCategoryId) || material.categoryId === studentCategoryId)) {
      return true;
    }
    // 3. Category Name or Course Name keyword matching
    const matCat = (material.categoryName || "").toLowerCase();
    const matCourse = (material.courseName || "").toLowerCase();
    const matSubj = (material.subject || "").toLowerCase();
    const stuCat = studentCategoryName.toLowerCase();
    const stuCourse = studentCourseName.toLowerCase();

    if (stuCat && stuCat !== "none" && (matCat.includes(stuCat) || stuCat.includes(matCat))) return true;
    if (stuCourse && stuCourse !== "none" && (matCourse.includes(stuCourse) || stuCourse.includes(matCourse) || matSubj.includes(stuCourse))) return true;

    // Specific keywords mapping
    if ((stuCourse.includes("ssc") || stuCat.includes("ssc")) && matCat.includes("ssc")) return true;
    if ((stuCourse.includes("cet") || stuCourse.includes("nra") || stuCourse.includes("railway")) && (matCat.includes("cet") || matCat.includes("railway"))) return true;
    if ((stuCourse.includes("bank") || stuCourse.includes("fci") || stuCourse.includes("epfo") || stuCourse.includes("cwc")) && matCat.includes("banking")) return true;
    if ((stuCourse.includes("aiims") || stuCourse.includes("paramedical") || stuCourse.includes("nursing") || stuCourse.includes("ruhs") || stuCourse.includes("pgimer")) && matCat.includes("paramedical")) return true;
    if ((stuCourse.includes("web") || stuCourse.includes("html") || stuCourse.includes("frontend")) && matCat.includes("web")) return true;
    if ((stuCourse.includes("csir") || stuCourse.includes("computer") || stuCourse.includes("isro")) && (matCat.includes("computer") || matCat.includes("web"))) return true;

    return false;
  };

  // Filter study materials based on selected Category Tab & Search Query
  const filteredMaterials = STUDY_MATERIALS.filter((material) => {
    // 1. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchTitle = material.title.toLowerCase().includes(query);
      const matchSubject = material.subject.toLowerCase().includes(query);
      const matchCategory = (material.categoryName || "").toLowerCase().includes(query);
      const matchContent = material.content.toLowerCase().includes(query);
      if (!matchTitle && !matchSubject && !matchCategory && !matchContent) return false;
    }

    // 2. Category Tab Filter
    if (selectedCategoryTab === "MY_CATEGORY") {
      const isMyMatch = matchesStudentCategory(material);
      // Fallback: if student enrolled in Web Dev (courseId: 1) or has no specific match, show course 1 or matching
      if (!isMyMatch && (!studentCourseId || Number(studentCourseId) === 1)) {
        return material.courseId === 1 || material.categoryName?.includes("Web Development");
      }
      return isMyMatch;
    }
    if (selectedCategoryTab === "ALL") return true;
    
    // Filter by specific Category Name tab
    const matCategory = (material.categoryName || "").toLowerCase();
    return matCategory.includes(selectedCategoryTab.toLowerCase());
  });

  const handleMarkAsRead = (lessonId: number) => {
    if (!readLessons.includes(lessonId)) {
      const updated = [...readLessons, lessonId];
      setReadLessons(updated);
      localStorage.setItem(`student_read_lessons_${student.student_id}`, JSON.stringify(updated));
      
      const foundMat = STUDY_MATERIALS.find(m => m.id === lessonId);
      saveActivity({
        id: Date.now(),
        type: "lesson",
        title: `Read Lesson: ${foundMat?.title || "Lesson"}`
      });
    }
  };

  const textHeading = isDark ? "text-white" : "text-slate-900";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* 1. Header Banner with Enrolled Category Context */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-7 text-white shadow-md shadow-emerald-950/15">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Tailored Scholar Learning Materials
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Study Course Materials
            </h2>
            <p className="mt-1 text-xs text-emerald-100 font-medium max-w-xl">
              Specialized notes & study guides compiled by foundation mentors according to your enrolled exam category.
            </p>
          </div>

          {/* Student Category Badge Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[240px] text-xs font-bold space-y-1">
            <p className="text-[10px] uppercase font-black text-emerald-200 tracking-wider flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" /> Your Enrolled Target
            </p>
            <p className="text-sm font-black truncate text-white">{studentCourseName !== "None" ? studentCourseName : "Standard Mock Test Pass"}</p>
            <p className="text-[10.5px] text-emerald-100 font-semibold truncate">
              Category: <span className="font-extrabold text-white">{studentCategoryName !== "None" ? studentCategoryName : "All Competitive Exams"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Category Tabs & Search Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setSelectedCategoryTab("MY_CATEGORY")}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              selectedCategoryTab === "MY_CATEGORY"
                ? "bg-emerald-600 text-white font-black shadow-sm"
                : "bg-slate-100 dark:bg-slate-850 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-yellow-300" />
            My Target Category
          </button>

          <button
            onClick={() => setSelectedCategoryTab("ALL")}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedCategoryTab === "ALL"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black shadow-sm"
                : "bg-slate-100 dark:bg-slate-850 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All Notes
          </button>

          <button
            onClick={() => setSelectedCategoryTab("SSC")}
            className={`px-3 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedCategoryTab === "SSC"
                ? "bg-emerald-600 text-white font-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            SSC & Govt
          </button>

          <button
            onClick={() => setSelectedCategoryTab("CET")}
            className={`px-3 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedCategoryTab === "CET"
                ? "bg-emerald-600 text-white font-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            NRA CET & Railways
          </button>

          <button
            onClick={() => setSelectedCategoryTab("Banking")}
            className={`px-3 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedCategoryTab === "Banking"
                ? "bg-emerald-600 text-white font-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Banking & Finance
          </button>

          <button
            onClick={() => setSelectedCategoryTab("Paramedical")}
            className={`px-3 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedCategoryTab === "Paramedical"
                ? "bg-emerald-600 text-white font-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Paramedical & Medical
          </button>

          <button
            onClick={() => setSelectedCategoryTab("Web Development")}
            className={`px-3 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedCategoryTab === "Web Development"
                ? "bg-emerald-600 text-white font-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Web Dev & CS
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study notes..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600"
          />
        </div>

      </div>

      {/* 3. Study Material Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filteredMaterials.length === 0 ? (
          <div className={`col-span-2 rounded-2xl border p-8 text-center ${isDark ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-white shadow-xs"}`}>
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className={`text-sm font-black ${textHeading}`}>No Study Materials Found</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {searchQuery ? "No study notes match your search keywords." : "No specialized notes currently match this category tab. Switch to 'All Notes' to explore more."}
            </p>
            <button
              onClick={() => { setSelectedCategoryTab("ALL"); setSearchQuery(""); }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              Browse All Notes Catalog
            </button>
          </div>
        ) : (
          filteredMaterials.map(note => (
            <div 
              key={note.id} 
              onClick={() => setSelectedNote(note)}
              className={`group border rounded-2xl p-5.5 flex flex-col justify-between transition duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                isDark 
                  ? "border-slate-800 bg-slate-900/30 hover:border-emerald-500/40 hover:bg-slate-900/60" 
                  : "border-slate-200 bg-white hover:border-emerald-500/40 shadow-xs"
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {note.categoryName || note.subject}
                  </span>
                  {readLessons.includes(note.id) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Read ✓
                    </span>
                  )}
                </div>
                <h3 className={`text-sm font-black group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug ${textHeading}`}>
                  {note.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">
                  {note.content}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {note.readTime}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition font-extrabold">
                  Read Lesson <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. LESSON DETAIL MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-xl rounded-3xl border p-6 shadow-2xl relative space-y-4 ${
            isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
          }`}>
            <button 
              onClick={() => setSelectedNote(null)} 
              className={`absolute top-4 right-4 rounded-xl p-1.5 transition cursor-pointer ${
                isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 text-left pr-8">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                {selectedNote.categoryName || selectedNote.subject}
              </span>
              <h3 className={`text-base font-black tracking-tight leading-snug ${textHeading}`}>
                {selectedNote.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {selectedNote.readTime} • {selectedNote.subject}
              </p>
            </div>

            <hr className={isDark ? "border-slate-800" : "border-slate-100"} />

            <div className="bg-slate-50/80 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-left select-text max-h-[320px] overflow-y-auto pr-2">
                {selectedNote.content}
              </p>
            </div>

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
                        confirmButtonColor: "#047857"
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as Read ✓
                  </button>
                ) : (
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
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
