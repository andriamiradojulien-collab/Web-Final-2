export type UserRole = 'admin' | 'student';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Exam {
  id: number;
  course_id: number;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Question {
  id: number;
  exam_id: number;
  statement: string;
  points: number;
  created_at: string;
}

export interface Choice {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
  position: number;
}

export interface Attempt {
  id: number;
  student_id: number;
  exam_id: number;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
}

export interface Answer {
  id: number;
  attempt_id: number;
  question_id: number;
  choice_id: number | null;
  is_correct: boolean | null;
  points_awarded: number;
}
