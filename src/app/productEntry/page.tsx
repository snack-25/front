'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import EntryHeader from '@/components/productEntry/EntryHeader';
import EntryList from '@/components/productEntry/EntryList';
import Pagination from '@/components/ui/Pagination';

import { getMockProductPage } from '../playground/entryMock';

export default function ProductEntry() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'createdAt:desc';
  const [dataList, setDataList] = useState(getMockProductPage(currentPage));

  useEffect(() => {
    const newPageData = getMockProductPage(currentPage);
    setDataList(newPageData);
  }, [currentPage, sort]);

  return (
    <>
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
    </>
  );
}
