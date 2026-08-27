import { pool } from '../config/db';
import { Question, Choice } from '../model/types';

export interface QuestionWithChoices extends Question {
  choices: Choice[];
}

export const questionRepository = {
  async listByExam(examId: number): Promise<QuestionWithChoices[]> {
    const { rows: questions } = await pool.query(
      'SELECT * FROM questions WHERE exam_id = $1 ORDER BY id ASC',
      [examId]
    );
    if (questions.length === 0) return [];
    const { rows: choices } = await pool.query(
      `SELECT c.* FROM choices c
       JOIN questions q ON q.id = c.question_id
       WHERE q.exam_id = $1 ORDER BY c.question_id, c.position`,
      [examId]
    );
    return questions.map((q) => ({
      ...q,
      choices: choices.filter((c) => c.question_id === q.id),
    }));
  },

  async findById(id: number): Promise<Question | null> {
    const { rows } = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
    return rows[0] || null;
  },

  // RG-04 validée par le trigger différé en base à la fin de la transaction
  async create(
    examId: number,
    statement: string,
    points: number,
    choices: { text: string; isCorrect: boolean }[]
  ): Promise<QuestionWithChoices> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: qRows } = await client.query(
        'INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *',
        [examId, statement, points]
      );
      const question = qRows[0];
      const insertedChoices: Choice[] = [];
      for (let i = 0; i < choices.length; i++) {
        const { rows: cRows } = await client.query(
          `INSERT INTO choices (question_id, text, is_correct, position)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [question.id, choices[i].text, choices[i].isCorrect, i]
        );
        insertedChoices.push(cRows[0]);
      }
      await client.query('COMMIT');
      return { ...question, choices: insertedChoices };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async update(
    id: number,
    statement: string,
    points: number,
    choices: { text: string; isCorrect: boolean }[]
  ): Promise<QuestionWithChoices> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: qRows } = await client.query(
        'UPDATE questions SET statement = $2, points = $3 WHERE id = $1 RETURNING *',
        [id, statement, points]
      );
      await client.query('DELETE FROM choices WHERE question_id = $1', [id]);
      const insertedChoices: Choice[] = [];
      for (let i = 0; i < choices.length; i++) {
        const { rows: cRows } = await client.query(
          `INSERT INTO choices (question_id, text, is_correct, position)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [id, choices[i].text, choices[i].isCorrect, i]
        );
        insertedChoices.push(cRows[0]);
      }
      await client.query('COMMIT');
      return { ...qRows[0], choices: insertedChoices };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async remove(id: number): Promise<void> {
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);
  },
};
