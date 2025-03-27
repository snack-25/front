'use client'
import { ReactNode, useContext, useState } from 'react';
import { createContext } from 'react';

interface IContext {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const PageContext = createContext<IContext | null>(null);

export default function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<number>(1);

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('Context를 Provider 안에서 사용해주세요');
  }
  return context;
}
