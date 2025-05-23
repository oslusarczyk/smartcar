import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { showToast } from '../../utils/toast';

export const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAdmin, user } = useAuth();
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    if (user && !isAdmin) {
      showToast('Nie masz uprawnień administratora do tej strony');
      setShowRedirect(true);
    }
  }, [isAdmin, user]);

  if (showRedirect) return <Navigate to="/" replace />;
  return children;
};
