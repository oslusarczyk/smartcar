import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToastOnce } from '../../hooks/useToastOnce';

export const LoggedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    useToastOnce(
      'Nie masz uprawnień administratora do tej strony',
      !isAuthenticated,
    );
    return <Navigate to="/auth" replace />;
  }

  return children;
};
