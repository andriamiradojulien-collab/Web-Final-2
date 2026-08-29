import { pool } from '../config/db';
import { PoolClient } from 'pg';
import { Attempt, Answer } from '../model/types';
import { ApiError } from '../utils/ApiError';

export const attemptRepository = {
  async findByStudentAndExam(studentId: number, examId: number): Promise<Attempt | null> {
    const { rows } = await pool.query(
        'SELECT * FROM attempts WHERE student_id = $1 AND exam_id = $2',
        [studentId, examId]
    );
    return rows[0] || null;
  },

  async createAttemptExclusive(client: PoolClient, studentId: number, examId: number): Promise<Attempt> {
    try {
      const { rows } = await client.query(
          'INSERT INTO attempts (student_id, exam_id) VALUES ($1, $2) RETURNING *',
          [studentId, examId]
      );
      return rows[0];
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ApiError(409, 'Cet examen a déjà été passé');
      }
      throw err;
    }
  },

  async saveAnswer(
      client: PoolClient,
      attemptId: number,
      questionId: number,
      choiceId: number | null,
      isCorrect: boolean | null,
      pointsAwarded: number
  ): Promise<Answer> {
    const { rows } = await client.query(
        `INSERT INTO answers (attempt_id, question_id, choice_id, is_correct, points_awarded)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [attemptId, questionId, choiceId, isCorrect, pointsAwarded]
    );
    return rows[0];
  },

  async markSubmitted(client: PoolClient, attemptId: number, score: number): Promise<Attempt> {
    const { rows } = await client.query(
        'UPDATE attempts SET submitted_at = now(), score = $2 WHERE id = $1 RETURNING *',
        [attemptId, score]
    );
    return rows[0];
  },

  async listByExam(examId: number) {
    const { rows } = await pool.query(
        `SELECT a.*, u.email AS student_email
       FROM attempts a
       JOIN users u ON u.id = a.student_id
       WHERE a.exam_id = $1
       ORDER BY a.score DESC NULLS LAST`,
        [examId]
    );
    return rows;
  },

  async listByStudent(studentId: number) {
    const { rows } = await pool.query(
        `SELECT a.*, e.name AS exam_name, c.name AS course_name
       FROM attempts a
       JOIN exams e ON e.id = a.exam_id
       JOIN courses c ON c.id = e.course_id
       WHERE a.student_id = $1
       ORDER BY a.submitted_at DESC NULLS LAST`,
        [studentId]
    );
    return rows;
  }
};