export interface Choice {
  id: number;
  questionId: number;
  label: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
  examId: number;
  statement: string;
  points: number;
  choices: Choice[];
}
