
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles/globals.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="app">
          <RouterProvider router={router} />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
