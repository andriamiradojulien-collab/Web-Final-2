import { pool } from '../config/db';
import { User } from '../model/types';

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  },

  async findById(id: number): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async listStudents(): Promise<User[]> {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC"
    );
    return rows;
  },

  async createStudent(email: string, passwordHash: string): Promise<User> {
    const { rows } = await pool.query(
        `INSERT INTO users (email, password_hash, role, is_active)
       VALUES ($1, $2, 'student', true) RETURNING *`,
        [email, passwordHash]
    );
    return rows[0];
  },

  async updateStudent(
      id: number,
      fields: { email?: string; passwordHash?: string; isActive?: boolean }
  ): Promise<User | null> {
    const { rows } = await pool.query(
        `UPDATE users SET
         email = COALESCE($2, email),
         password_hash = COALESCE($3, password_hash),
         is_active = COALESCE($4, is_active)
       WHERE id = $1 AND role = 'student'
       RETURNING *`,
        [id, fields.email ?? null, fields.passwordHash ?? null, fields.isActive ?? null]
    );
    return rows[0] || null;
  },

  async deactivateStudent(id: number): Promise<User | null> {
    const { rows } = await pool.query(
        "UPDATE users SET is_active = false WHERE id = $1 AND role = 'student' RETURNING *",
        [id]
    );
    return rows[0] || null;
  }
};