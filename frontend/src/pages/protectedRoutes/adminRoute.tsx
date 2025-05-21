import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToastOnce } from '../../hooks/useToastOnce';

export const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    useToastOnce('Nie masz uprawnień administratora do tej strony', !isAdmin);
    return <Navigate to="/auth" replace />;
  }

  return children;
};
