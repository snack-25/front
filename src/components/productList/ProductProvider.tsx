'use client';
import { Tsort } from '@/app/productList/page';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface IContext {
  parentId: string;
  setParentId: Dispatch<SetStateAction<string>>;
  categoryId: string;
  setCategoryId: Dispatch<SetStateAction<string>>;
  sort: Tsort;
  setSort: Dispatch<SetStateAction<Tsort>>;
}

export const ProviderContext = createContext<IContext | null>(null);

export default function ProductProvider({ children }: PropsWithChildren) {
  const [sort, setSort] = useState<Tsort>('createdAt:desc');
  const [parentId, setParentId] = useState<string>('cat-스낵');
  const [categoryId, setCategoryId] = useState<string>('sub-과자');

  const value = {
    sort,
    setSort,
    parentId,
    setParentId,
    categoryId,
    setCategoryId,
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
}

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider를 Provider 안에서 사용해 주세요');
  }
  return context;
};
