import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { fetchApi } from '@/app/api/instance';

export const useFetchProducts = () => {
  const searchParams = useSearchParams(); 
  const category = searchParams.get('categoryId');
  const sort = searchParams.get('sort');

  const fetchProducts = useCallback(
    async (page: number) => {
      try {
        const url = `/api/products?page=${page}&limit=8&categoryId=${category}&sort=${sort}`;
        const data = await fetchApi(url, { method: 'GET' });

        if (process.env.NODE_ENV === 'development') {
          console.log('상품 목록 조회 성공:', data);
        }

        return data;
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('상품 목록 조회 실패:', err);
        }
      }
    },
    [category, sort],
  );

  return fetchProducts;
};
