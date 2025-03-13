'use client';
import { useEffect, useState } from 'react';

import TabMenu from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import { SortDropDown } from '@/components/productList/SortDropDown';
import { sortBy } from '@/components/productList/SortDropDown';

export default function ProductList() {
  const [sort, setSort] = useState<sortBy>('newest');
  const [mainCategory, setMainCategory] =
    useState<string>('snack'); /* 초기 렌더링시 스낵-스낵을 디폴트 */
  const [subCategory, setSubCategory] = useState<string>('snack');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('정렬 기준:', sort);
    }
  }, [sort]);

  return (
    <>
      <TabMenu
        mainCategory={mainCategory}
        subCategory={subCategory}
        setMain={setMainCategory}
        setSub={setSubCategory}
      />
      <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex  items-center justify-end'>
        <SortDropDown
          value={sort}
          setValue={setSort}
        />
      </div>

      <CardList />
    </>
  );
}
