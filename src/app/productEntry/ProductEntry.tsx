'use client';
import EntryHeader from '@/components/productEntry/EntryHeader';
import EntryList from '@/components/productEntry/EntryList';
import Pagination from '@/components/ui/Pagination';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getMockProductPage } from '../playground/entryMock';

export default function ProductEntry() {
  /**
   * useSearchParams() should be wrapped in a suspense boundary at page "/productEntry".
   * Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
   * useSearchParams()에 대한 호출은 Suspense 경계로 감싸져 있어야 함
   **/
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'createdAt:desc';
  const [dataList, setDataList] = useState(getMockProductPage(currentPage));

  useEffect(() => {
    const newPageData = getMockProductPage(currentPage);
    setDataList(newPageData);
  }, [currentPage, sort]);

  return (
    <div className='flex flex-col lt:px-[120px] w-full'>
      <EntryHeader />

      <main className='flex flex-col gap-4'>
        <EntryList items={dataList.items} />
      </main>

      <Pagination
        currentPage={currentPage}
        totalPage={9}
      />
    </div>
  );
}
