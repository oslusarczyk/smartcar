import { useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useToastOnce = (message: string, condition: boolean = true) => {
  const hasShown = useRef(false);

  useEffect(() => {
    if (condition && !hasShown.current) {
      toast.error(message);
      hasShown.current = true;
    }
  }, [condition, message]);
};
