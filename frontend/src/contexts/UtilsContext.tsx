import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBrands, getLocations } from '../api/utilsApi';
import type { UtilsContextType } from './UtilsTypes';

const UtilsContext = createContext<UtilsContextType | null>(null);

export const UtilsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 1000 * 60 * 60,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <UtilsContext.Provider value={{ brands, locations }}>
      {children}
    </UtilsContext.Provider>
  );
};

export const useUtils = () => {
  const ctx = useContext(UtilsContext);
  if (!ctx) throw new Error('useUtils must be used within UtilsProvider');
  return ctx;
};
