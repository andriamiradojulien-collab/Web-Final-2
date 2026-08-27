import { userRepository } from '../repository/userRepository';
import { comparePassword } from '../security/password';
import { signToken } from '../security/jwt';
import { ApiError } from '../utils/ApiError';

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new ApiError(401, 'Email ou mot de passe incorrect');
    if (!user.is_active) throw new ApiError(403, 'Ce compte a été désactivé'); // RG-11
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) throw new ApiError(401, 'Email ou mot de passe incorrect');
    const token = signToken({ sub: user.id, role: user.role });
    return { token, role: user.role };
  },
};
