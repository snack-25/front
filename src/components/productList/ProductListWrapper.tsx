'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductList from '@/app/productList/ProductList';

export default function ProductListWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allowRender, setAllowRender] = useState(false);
  const isFirst = useRef(true);
  const page = Number(searchParams.get('page') || '1');

  useEffect(() => {
    const handleRedirect = async () => {
      if (isFirst.current && page > 1) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('page', '1');
        await router.replace(`?${newParams.toString()}`); //비동기 처리로 replace 이후에 렌더링되도록 함
        return;
      }

      setAllowRender(true);
      isFirst.current = false;
    };

    handleRedirect();
  }, [page]);

  if (!allowRender) {
    return null;
  }

  return <ProductList />;
}
