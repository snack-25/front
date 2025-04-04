'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/app/auth/useAuthStore';
import { fetchApi } from '@/app/api/instance';
import { IProducts } from '@/app/productList/ProductList';
import { Category } from '@/components/gnb/TabMenu';
import { showCustomToast } from '@/components/ui/Toast/Toast';

export default function useCategory() {
  const searchParams = useSearchParams();
  const mainCategory = searchParams.get('parentId') as string;
  const subCategory = searchParams.get('categoryId') as string;

  const [mainName, setMainName] = useState<string>('');
  const [subName, setSubName] = useState<string>('');
  const { isAuth, isHydrated } = useAuthStore();

  const getParents = async (): Promise<Category[]> => {
    try {
      if (!isHydrated || !isAuth) {
        return [];
      }
      const parents: Category[] = await fetchApi('/categories/parents', {
        method: 'GET',
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('상위 카테고리 패칭 완료:', parents);
      }
      return parents;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log('상위 카테고리 패칭 실패:', err);
      }
      showCustomToast({ label: '상위 패칭 실패', variant: 'error' });
      return [];
    }
  };

  const getSub = async (parentId: string): Promise<Category[]> => {
    //하위 카테고리 목록 패칭 함수
    try {
      if (!isHydrated || !isAuth) {
        return [];
      }
      const sub: Category[] = await fetchApi(
        `/categories/parents/${parentId}`,
        { method: 'GET' },
      );
      if (process.env.NODE_ENV === 'development') {
        console.log('초기 하위 카테고리 패칭 완료:', sub);
      }
      return sub;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log('초기 하위 카테고리 패칭 실패:', err);
      }
      return [];
    }
  };

  useEffect(() => {
    if (!isHydrated || !isAuth) {
      return;
    }
    let isMounted = true;

    const fetchName = async () => {
      try {
        const data: IProducts[] = await fetchApi('/categories/all');
        if (!isMounted) {
          return;
        }

        const mainData = data.find((item) => item.id === mainCategory);
        const subData = data.find((item) => item.id === subCategory);

        setMainName(mainData?.name || '상위 카테고리');
        setSubName(subData?.name || '하위 카테고리');
      } catch (e) {
        console.error('카테고리 이름 가져오기 실패:', e);
      }
    };

    fetchName();

    return () => {
      isMounted = false;
    };
  }, [mainCategory, subCategory, isAuth]);

  return { getParents, getSub, mainName, subName };
}
