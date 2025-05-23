import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { showToast } from '../../utils/toast';

export const LoggedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, wasLoggedOut } = useAuth();
  if (!isAuthenticated && !wasLoggedOut) {
    showToast('Nie jesteś zalogowany.', !isAuthenticated);
    return <Navigate to="/auth" replace />;
  }

  return children;
};
