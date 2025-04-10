'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/app/api/instance';

import EntryHeader from '@/components/productEntry/EntryHeader';
import Pagination from '@/components/ui/Pagination';
import EntryList from '@/components/productEntry/EntryList';

export default function ProductEntry() {
  const [dataList, setDataList] = useState({ items: [] });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await fetchApi('/products/my-products');
        setDataList(data);
      } catch (error) {
        console.error('상품 목록 로딩 실패:', error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className='flex flex-col lt:px-[120px] w-full'>
      <EntryHeader />

      <main className='flex flex-col gap-4'>
        <EntryList items={dataList?.items} />
      </main>

      <Pagination
        currentPage={1}
        totalPage={1}
      />
    </div>
  );
}
