import { User } from 'next-auth';

export interface UserWithRole extends User {
  role?: string; // Add the 'role' property
}

export interface SessionUserWithRole extends Omit<User, 'id'> {
  role?: string; // Add the 'role' property
}
