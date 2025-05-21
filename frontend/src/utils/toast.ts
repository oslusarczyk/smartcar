import { toast } from 'react-hot-toast';

export const showToast = (message: string, condition: boolean = true) => {
  if (condition) {
    toast.error(message);
  }
};
