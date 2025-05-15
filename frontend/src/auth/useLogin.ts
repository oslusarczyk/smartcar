import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login({ token: data.access_token, user: data.user });
      toast.success('Hello World');
    },
  });
};
