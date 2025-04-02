import { useCallback } from 'react';

import { fetchApi } from '@/app/api/instance';
import { Tsort } from '@/app/productList/ProductList';
import EmptyImage from '@/components/productList/EmptyImage';

export const useFetchProducts = () => {
  const fetchProducts = useCallback(
    async (page: number, categoryId: string, sort: Tsort) => {
      try {
        const url = `/products?page=${page}&limit=8&categoryId=${categoryId}&sort=${sort}`;
        const data = await fetchApi(url, { method: 'GET' });

        if (process.env.NODE_ENV === 'development') {
          console.log('상품 목록 조회 성공:', data);
        }

        return data;
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('상품 목록 조회 실패:', err);
        }
        return <EmptyImage />;
      }
    },
    [],
  );

  return { fetchProducts };
};
