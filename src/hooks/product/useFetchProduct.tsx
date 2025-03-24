import { useCallback, useState } from 'react';
import { fetchApi } from '@/app/api/instance';
import { Tsort } from '@/app/productList/page';

export const useFetchProducts = () => {
  const fetchProducts = useCallback(
    async (page: number, categoryId: string, sort: Tsort) => {
      try {
        const url = `/api/products?page=${page}&limit=8&categoryId=${categoryId}&sort=${sort}`;
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
    [],
  );

  return { fetchProducts };
};
