import { courseRepository } from '../repository/courseRepository';
import { ApiError } from '../utils/ApiError';

export const courseService = {
  list: () => courseRepository.list(),

  async create(code: string, name: string, description: string | null) {
    if (!code || !name) throw new ApiError(400, 'Code et nom du cours requis');
    return courseRepository.create(code, name, description ?? null);
  },

  async update(id: number, fields: { code?: string; name?: string; description?: string }) {
    const course = await courseRepository.update(id, fields);
    if (!course) throw new ApiError(404, 'Cours introuvable');
    return course;
  },

  async remove(id: number) {
    const course = await courseRepository.findById(id);
    if (!course) throw new ApiError(404, 'Cours introuvable');
    await courseRepository.remove(id);
  }
};