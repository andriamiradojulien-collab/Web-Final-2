import { pool } from '../config/db';
import { Exam } from '../model/types';
import { ApiError } from '../utils/ApiError';

export const examRepository = {
  async list(): Promise<Exam[]> {
    const { rows } = await pool.query('SELECT * FROM exams ORDER BY start_date DESC');
    return rows;
  },

  async findById(id: number): Promise<Exam | null> {
    const { rows } = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create(courseId: number, name: string, startDate: string, endDate: string): Promise<Exam> {
    const { rows } = await pool.query(
        `INSERT INTO exams (course_id, name, start_date, end_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
        [courseId, name, startDate, endDate]
    );
    return rows[0];
  },

  async update(
      id: number,
      fields: { name?: string; startDate?: string; endDate?: string }
  ): Promise<Exam | null> {
    const { rows } = await pool.query(
        `UPDATE exams SET
         name = COALESCE($2, name),
         start_date = COALESCE($3, start_date),
         end_date = COALESCE($4, end_date)
       WHERE id = $1 RETURNING *`,
        [id, fields.name ?? null, fields.startDate ?? null, fields.endDate ?? null]
    );
    return rows[0] || null;
  },

  async remove(id: number): Promise<void> {
    try {
      await pool.query('DELETE FROM exams WHERE id = $1', [id]);
    } catch (err: any) {
      if (err.code === '23503') {
        throw new ApiError(409, 'Impossible de supprimer un examen possédant des tentatives');
      }
      throw err;
    }
  },

  async hasAttempts(examId: number): Promise<boolean> {
    const { rows } = await pool.query('SELECT 1 FROM attempts WHERE exam_id = $1 LIMIT 1', [examId]);
    return rows.length > 0;
  },

  async listAvailableForStudent(studentId: number): Promise<Exam[]> {
    const { rows } = await pool.query(
        `SELECT e.* FROM exams e
       WHERE now() BETWEEN e.start_date AND e.end_date
         AND NOT EXISTS (
           SELECT 1 FROM attempts a WHERE a.exam_id = e.id AND a.student_id = $1
         )
       ORDER BY e.start_date ASC`,
        [studentId]
    );
    return rows;
  }
};