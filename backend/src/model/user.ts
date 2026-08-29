export type UserRole = "admin" | "student";
export type UserStatus = "active" | "disabled";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
