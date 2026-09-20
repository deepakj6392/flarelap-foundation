export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  dob?: string | null;
  address?: string | null;
  student_id: string;
  created_at: string;
  course_name?: string;
  course_id?: number | string;
  category_id?: number | string;
  category_name?: string;
}

export interface StudyMaterial {
  id: number;
  courseId?: number | string;
  courseName?: string;
  categoryId?: number | string;
  categoryName?: string;
  subject: string;
  title: string;
  readTime: string;
  content: string;
}

export interface Activity {
  id: number;
  type: "lesson" | "quiz" | "login" | "logout";
  title: string;
  timestamp: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint: string;
}

export interface StudentLog {
  id: number;
  action: string;
  timestamp: string;
}

// Study materials array (empty by default; populated dynamically from database)
export const STUDY_MATERIALS: StudyMaterial[] = [];
