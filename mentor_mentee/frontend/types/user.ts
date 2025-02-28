export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'mentor' | 'mentee' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export type UserRole = User['role']; 