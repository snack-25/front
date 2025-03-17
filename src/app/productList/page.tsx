'use client';
import { Suspense, useState } from 'react';

import TabMenu from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import { SortDropDown } from '@/components/productList/SortDropDown';
import ProductFormModal from '@/components/ui/modal/ProductFormModal';
import FloatingButton from '@/components/productList/FloatingButton';
import MoreButton from '@/components/productList/MoreButton';

export default function ProductList() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAuthenticated: boolean = true;

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // 등록 모달 제출 함수
  const handleSubmit = () => {
    /* 등록 api 연동 */
  };

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
      {isAuthenticated /* 관리자 이상의 권한일때만 보임 */ && (
        <FloatingButton
          handleClick={handleOpen}
          className='fixed bottom-[10vh] right-[120px] max-lt:right-6'
        />
      )}

      <ProductFormModal
        isOpen={isOpen}
        onClose={handleOpen}
        onConfirm={handleSubmit}
      />

      <MoreButton
        className='w-full flex items-center justify-center my-16'
        onClick={() => {}}
      />
    </>
  );
}
