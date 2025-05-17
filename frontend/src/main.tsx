import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { UtilsProvider } from './contexts/UtilsContext.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UtilsProvider>
          <AuthProvider>
            <Toaster
              position="bottom-left"
              toastOptions={{
                duration: 2000,
              }}
            />
            <App />
          </AuthProvider>
        </UtilsProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
