import type { User } from '../utils/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  wasLoggedOut: boolean;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    has_admin_privileges: boolean;
  };
}
