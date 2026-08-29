export interface Attempt {
  id: number;
  studentId: number;
  examId: number;
  score: number;
  submittedAt: string;
}

export interface SubmittedAnswer {
  questionId: number;
  choiceId: number | null;
}
