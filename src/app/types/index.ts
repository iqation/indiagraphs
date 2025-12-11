export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
  GUEST = "GUEST",
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  is_active: string;
  role: string;
  createdAt: string;
  updateAt: Date;
}
