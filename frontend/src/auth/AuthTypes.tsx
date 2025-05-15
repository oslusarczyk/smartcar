export interface User {
  id: string;
  email: string;
  has_admin_privileges: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    has_admin_privileges: boolean;
  };
}
