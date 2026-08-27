import { attemptRepository } from '../repository/attemptRepository';
import { examRepository } from '../repository/examRepository';
import { questionRepository } from '../repository/questionRepository';
import { ApiError } from '../utils/ApiError';

export const examResultService = {
  async getResults(examId: number) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    const questions = await questionRepository.listByExam(examId);
    const totalPoints = questions.reduce((sum, q) => sum + Number(q.points), 0);
    const attempts = await attemptRepository.listByExam(examId);
    // Seuil d'admission : 50% du total des points, à ajuster selon les besoins réels
    return attempts.map((a: any) => ({
      studentEmail: a.student_email,
      score: a.score,
      totalPoints,
      submittedAt: a.submitted_at,
      admis: a.score !== null && totalPoints > 0 ? Number(a.score) >= totalPoints / 2 : false,
    }));
  },
};
