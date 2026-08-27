import { userRepository } from '../repository/userRepository';
import { hashPassword } from '../security/password';
import { ApiError } from '../utils/ApiError';

export const studentService = {
  async list() {
    const students = await userRepository.listStudents();
    return students.map(({ password_hash, ...rest }) => rest);
  },

  async create(email: string, password: string) {
    if (!email || !password) throw new ApiError(400, 'Email et mot de passe requis');
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ApiError(409, 'Cet email est déjà utilisé');
    const hash = await hashPassword(password);
    const student = await userRepository.createStudent(email, hash);
    const { password_hash, ...rest } = student;
    return rest;
  },

  async update(id: number, fields: { email?: string; password?: string; isActive?: boolean }) {
    const passwordHash = fields.password ? await hashPassword(fields.password) : undefined;
    const updated = await userRepository.updateStudent(id, {
      email: fields.email,
      passwordHash,
      isActive: fields.isActive,
    });
    if (!updated) throw new ApiError(404, 'Étudiant introuvable');
    const { password_hash, ...rest } = updated;
    return rest;
  },

  async deactivate(id: number) {
    const updated = await userRepository.deactivateStudent(id); // RG-10
    if (!updated) throw new ApiError(404, 'Étudiant introuvable');
    const { password_hash, ...rest } = updated;
    return rest;
  },
};
