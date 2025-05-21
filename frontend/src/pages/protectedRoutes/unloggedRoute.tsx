import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export const UnloggedRoute = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
