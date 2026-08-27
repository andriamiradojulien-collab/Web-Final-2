import { pool } from '../config/db';
import { Course } from '../model/types';
import { ApiError } from '../utils/ApiError';

export const courseRepository = {
  async list(): Promise<Course[]> {
    const { rows } = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    return rows;
  },

  async findById(id: number): Promise<Course | null> {
    const { rows } = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create(code: string, name: string, description: string | null): Promise<Course> {
    const { rows } = await pool.query(
      `INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [code, name, description]
    );
    return rows[0];
  },

  async update(
    id: number,
    fields: { code?: string; name?: string; description?: string }
  ): Promise<Course | null> {
    const { rows } = await pool.query(
      `UPDATE courses SET
         code = COALESCE($2, code),
         name = COALESCE($3, name),
         description = COALESCE($4, description)
       WHERE id = $1 RETURNING *`,
      [id, fields.code ?? null, fields.name ?? null, fields.description ?? null]
    );
    return rows[0] || null;
  },

  async remove(id: number): Promise<void> {
    try {
      // RG-09 : un cours possédant des examens ne peut pas être supprimé (FK RESTRICT)
      await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    } catch (err: any) {
      if (err.code === '23503') {
        throw new ApiError(409, 'Impossible de supprimer un cours possédant des examens');
      }
      throw err;
    }
  },
};
