
import { createContext, useContext, ReactNode } from 'react';
import { useSignature } from '@/hooks/useSignature';

type SignatureContextType = ReturnType<typeof useSignature>;

const SignatureContext = createContext<SignatureContextType | null>(null);

export function SignatureProvider({ children }: { children: ReactNode }) {
  const signature = useSignature();
  return (
    <SignatureContext.Provider value={signature}>
      {children}
    </SignatureContext.Provider>
  );
}

export function useSignatureContext() {
  const ctx = useContext(SignatureContext);
  if (!ctx) throw new Error('useSignatureContext must be used within SignatureProvider');
  return ctx;
}
