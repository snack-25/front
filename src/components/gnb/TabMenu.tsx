'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchApi } from '@/app/api/instance';
import { useAuthStore } from '@/app/auth/useAuthStore';
import useCategory from '@/hooks/product/useCategory';

import ParentTab from './ParentTab';
import SubTab from './SubTab';

export interface Category {
  id: string;
  parentId: string | null;
  companyId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ulStyle =
  'flex h-16 text-gray-400 text-2lg font-medium px-[120px] max-lt:px-6 gap-3 items-center border-b-1 border-line-200 overflow-x-scroll whitespace-nowrap no-scrollbar';
export const buttonStyle =
  'w-full h-full cursor-pointer transition-all duration-75 hover:text-primary-400';

export default function TabMenu() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { isAuth, isHydrated } = useAuthStore();
  const { getParents, getSub } = useCategory();

  const parentId = searchParams.get('parentId');
  const categoryId = searchParams.get('categoryId');

  const [parents, setParents] = useState<Category[]>([]); //상위 카테고리 목록
  const [sub, setSub] = useState<Category[] | null>(null); //하위 카테고리 목록

  useEffect(() => {
    const fetchParents = async () => {
      const parents = await getParents();
      setParents(parents);
    };
    fetchParents();
  }, []);

  useEffect(() => {
    const fetchSub = async () => {
      if (parentId) {
        const sub = await getSub(parentId);
        setSub(sub);
      }
    };
    fetchSub();
  }, [parentId]);

  useEffect(() => {
    if (!sub || sub.length === 0) {
      return;
    }

    const currentCategoryId = searchParams.get('categoryId');
    const isCurrentValid = sub.some((s) => s.id === currentCategoryId);

    if (!isCurrentValid) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('categoryId', sub[0].id);
      newParams.set('sort', 'createdAt:desc');
      router.replace(`?${newParams.toString()}`);
      return;
    }
  }, [sub]);

  const handleCategory = async (
    level: 'parentId' | 'categoryId',
    value: string,
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(level, value);
    newParams.set('page', '1');

    if (level === 'parentId') {
      const sub: Category[] = await fetchApi(`/categories/parents/${value}`, {
        method: 'GET',
      });
      const initCategoryId = sub[0].id;
      newParams.set('categoryId', initCategoryId);
      newParams.set('sort', 'createdAt:desc');
    }
    if (pathName.includes('detail')) {
      router.push(`/productList?${newParams.toString()}`);
    } else {
      router.replace(`?${newParams.toString()}`);
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav>
        <ParentTab
          parents={parents}
          currentParentId={parentId}
          onClick={handleCategory}
        />
        <SubTab
          sub={sub}
          currentCategoryId={categoryId}
          onClick={handleCategory}
        />
      </nav>
    </motion.div>
  );
}
