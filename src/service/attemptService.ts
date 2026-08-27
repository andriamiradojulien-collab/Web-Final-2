import { pool } from '../config/db';
import { examRepository } from '../repository/examRepository';
import { questionRepository } from '../repository/questionRepository';
import { attemptRepository } from '../repository/attemptRepository';
import { ApiError } from '../utils/ApiError';

interface SubmittedAnswer {
  questionId: number;
  choiceId?: number;
}

export const attemptService = {
  async listAvailableExams(studentId: number) {
    return examRepository.listAvailableForStudent(studentId); // RG-03
  },

  async getExamForStudent(studentId: number, examId: number) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    const now = new Date();
    if (now < new Date(exam.start_date) || now > new Date(exam.end_date)) {
      throw new ApiError(409, "Cet examen n'est pas dans sa fenêtre de disponibilité"); // RG-03
    }
    const existing = await attemptRepository.findByStudentAndExam(studentId, examId);
    if (existing) throw new ApiError(409, 'Vous avez déjà passé cet examen'); // RG-02
    const questions = await questionRepository.listByExam(examId);
    return {
      exam,
      // RG-07 : ne jamais renvoyer is_correct à l'étudiant
      questions: questions.map((q) => ({
        id: q.id,
        statement: q.statement,
        points: q.points,
        choices: q.choices.map((c) => ({ id: c.id, text: c.text })),
      })),
    };
  },

  async submit(studentId: number, examId: number, answers: SubmittedAnswer[]) {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    const now = new Date();
    if (now < new Date(exam.start_date) || now > new Date(exam.end_date)) {
      throw new ApiError(409, "Cet examen n'est pas dans sa fenêtre de disponibilité"); // RG-03
    }

    const questions = await questionRepository.listByExam(examId);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // RG-02 : unicité garantie par la contrainte UNIQUE, traduite en 409 ici
      const attempt = await attemptRepository.createAttemptExclusive(client, studentId, examId);

      let totalScore = 0;
      const detail: any[] = [];

      for (const q of questions) {
        const given = answers.find((a) => a.questionId === q.id);
        const choiceId = given?.choiceId ?? null; // RG-05 : question non répondue = 0 point
        let isCorrect: boolean | null = null;
        let pointsAwarded = 0;

        if (choiceId != null) {
          const choice = q.choices.find((c) => c.id === choiceId);
          if (!choice) throw new ApiError(400, `Choix invalide pour la question ${q.id}`);
          isCorrect = choice.is_correct;
          pointsAwarded = choice.is_correct ? Number(q.points) : 0; // RG-06 : calcul serveur uniquement
        }

        totalScore += pointsAwarded;
        await attemptRepository.saveAnswer(client, attempt.id, q.id, choiceId, isCorrect, pointsAwarded);

        detail.push({
          questionId: q.id,
          statement: q.statement,
          points: q.points,
          choices: q.choices.map((c) => ({ id: c.id, text: c.text, isCorrect: c.is_correct })),
          selectedChoiceId: choiceId,
          isCorrect,
          pointsAwarded,
        });
      }

      await attemptRepository.markSubmitted(client, attempt.id, totalScore);
      await client.query('COMMIT');

      return { score: totalScore, submittedAt: new Date().toISOString(), detail }; // RG-12
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async getMyResults(studentId: number) {
    const attempts = await attemptRepository.listByStudent(studentId);
    const graded = attempts.filter((a: any) => a.score !== null);
    const average =
      graded.length > 0 ? graded.reduce((s: number, a: any) => s + Number(a.score), 0) / graded.length : null;
    return { attempts, average };
  },
};
