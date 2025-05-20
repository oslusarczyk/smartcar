import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export const LoggedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};
