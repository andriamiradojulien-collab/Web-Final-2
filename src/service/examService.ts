import { examRepository } from '../repository/examRepository';
import { courseRepository } from '../repository/courseRepository';
import { ApiError } from '../utils/ApiError';

export const examService = {
  list: () => examRepository.list(),

  async getById(id: number) {
    const exam = await examRepository.findById(id);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    return exam;
  },

  async create(courseId: number, name: string, startDate: string, endDate: string) {
    if (!courseId || !name || !startDate || !endDate) {
      throw new ApiError(400, 'Tous les champs sont requis');
    }
    if (new Date(endDate) <= new Date(startDate)) {
      throw new ApiError(400, 'La date de fin doit être après la date de début');
    }
    const course = await courseRepository.findById(courseId);
    if (!course) throw new ApiError(404, 'Cours introuvable');
    return examRepository.create(courseId, name, startDate, endDate);
  },

  async update(id: number, fields: { name?: string; startDate?: string; endDate?: string }) {
    const exam = await examRepository.update(id, fields);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    return exam;
  },

  async remove(id: number) {
    const exam = await examRepository.findById(id);
    if (!exam) throw new ApiError(404, 'Examen introuvable');
    await examRepository.remove(id); // RG-09
  },
};
