import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { showToast } from '../../utils/toast';

export const LoggedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    showToast(
      'Nie masz uprawnień administratora do tej strony',
      !isAuthenticated,
    );
    return <Navigate to="/auth" replace />;
  }

  return children;
};
