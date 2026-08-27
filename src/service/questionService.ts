import { questionRepository } from '../repository/questionRepository';
import { examRepository } from '../repository/examRepository';
import { ApiError } from '../utils/ApiError';

interface ChoiceInput {
  text: string;
  isCorrect: boolean;
}

function validateChoices(choices: ChoiceInput[]) {
  // RG-04 : validation applicative en première ligne (le trigger SQL est le filet de sécurité)
  if (!choices || choices.length < 2 || choices.length > 6) {
    throw new ApiError(400, 'Une question doit avoir entre 2 et 6 choix');
  }
  const correctCount = choices.filter((c) => c.isCorrect).length;
  if (correctCount !== 1) {
    throw new ApiError(400, 'Une question doit avoir exactement un choix correct');
  }
}

async function assertExamNotLocked(examId: number) {
  const locked = await examRepository.hasAttempts(examId); // RG-08
  if (locked) {
    throw new ApiError(409, 'Cet examen a déjà reçu des tentatives : questions verrouillées');
  }
}

export const questionService = {
  async listForExam(examId: number) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    return questionRepository.listByExam(examId); // vue admin : is_correct inclus
  },

  async create(examId: number, statement: string, points: number, choices: ChoiceInput[]) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    if (!statement) throw new ApiError(400, 'Énoncé requis');
    validateChoices(choices);
    await assertExamNotLocked(examId);
    return questionRepository.create(examId, statement, points ?? 1, choices);
  },

  async update(id: number, statement: string, points: number, choices: ChoiceInput[]) {
    const question = await questionRepository.findById(id);
    if (!question) throw new ApiError(404, 'Question introuvable');
    validateChoices(choices);
    await assertExamNotLocked(question.exam_id); // RG-08
    return questionRepository.update(id, statement, points ?? 1, choices);
  },

  async remove(id: number) {
    const question = await questionRepository.findById(id);
    if (!question) throw new ApiError(404, 'Question introuvable');
    await assertExamNotLocked(question.exam_id); // RG-08
    await questionRepository.remove(id);
  },
};
