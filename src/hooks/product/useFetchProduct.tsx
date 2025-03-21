import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { fetchApi } from '@/app/api/instance';

export const useFetchProducts = () => {
  const searchParams = useSearchParams(); 
  const category = searchParams.get('categoryId');
  let sort = searchParams.get('sort');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProducts = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        if (!sort || sort === 'null') {
          sort = 'createdAt:desc';
        }

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
      } finally{
        setIsLoading(false);
      }
    },
    [category, sort],
  );

  return {fetchProducts, isLoading};
};
