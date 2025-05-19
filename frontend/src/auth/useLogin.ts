import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login({ token: data.access_token, user: data.user });
    },
    onError: (err: any) => {
      toast.error(err.response.data.message);
      // Handle error (e.g., show a notification)
    },
  });
};
