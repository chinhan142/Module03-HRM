export type UserRole = "ADMIN" | "USER";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  gender: Gender;
  dob: string;
  address: string;
}
