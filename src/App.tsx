
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Layout } from '@/components/layout/Layout';
import './styles/globals.css';
import { LanguageProvider } from './contexts/LanguageContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="app">
          <Layout>
            <RouterProvider router={router} />
          </Layout>
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
