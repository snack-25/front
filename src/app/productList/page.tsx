import { Suspense } from 'react';

import TabMenu from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import { SortDropDown } from '@/components/productList/SortDropDown';

export default function ProductList() {
  return (
    <>
      <Suspense fallback={<div>로딩중...</div>}>
        <TabMenu />
      </Suspense>
      <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex  items-center justify-end'>
        <Suspense fallback={<div>로딩중...</div>}>
          <SortDropDown />
        </Suspense>
      </div>

      <CardList />
    </>
  );
}
