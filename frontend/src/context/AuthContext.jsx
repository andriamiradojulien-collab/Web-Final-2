import { createContext, useContext, useState } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('examhub_token'));
  const [role, setRole] = useState(localStorage.getItem('examhub_role'));

  async function login(email, password) {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    localStorage.setItem('examhub_token', data.token);
    localStorage.setItem('examhub_role', data.role);
    setToken(data.token);
    setRole(data.role);
  }

  function logout() {
    localStorage.removeItem('examhub_token');
    localStorage.removeItem('examhub_role');
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
