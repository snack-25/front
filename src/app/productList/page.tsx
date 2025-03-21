'use client';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import TabMenu, { Category } from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import FloatingButton from '@/components/productList/FloatingButton';
import MoreButton from '@/components/productList/MoreButton';
import { SortDropDown } from '@/components/productList/SortDropDown';
import ProductFormModal from '@/components/ui/modal/ProductFormModal';

import { fetchApi } from '../api/instance';

export type Tsort =
  | 'createdAt:asc'
  | 'createdAt:desc'
  | 'price:asc'
  | 'price:desc';

export interface IProducts {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: Category['id'];
  imageUrl: string;
}

export default function ProductList() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAuthenticated: boolean = true;
  const [activeSub, setActiveSub] = useState<string>('sub-과자');
  const [sort, setSort] = useState<Tsort>('createdAt:desc');
  const [products, setProducts] = useState<IProducts[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `/api/products?&page=${page}&limit=${limit}&categoryId=${activeSub}`;
        const data = await fetchApi(url, { method: 'GET' });
        if (process.env.NODE_ENV === 'development') {
          console.log('전체 목록 조회 성공:', data);
        }
        setProducts(data.items);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('전체 목록 조회 실패:', err);
        }
      }
    };
    fetchProducts();
  }, [activeSub]);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // 등록 모달 제출 함수
  const handleSubmit = () => {
    /* 등록 api 연동 */
  };

  return (
    <>
      {products ? (
        <div className='relative'>
          <Suspense fallback={<div>로딩중...</div>}>
            <TabMenu
              activeSub={activeSub}
              setActiveSub={setActiveSub}
            />
          </Suspense>
          <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex  items-center justify-end'>
            <Suspense fallback={<div>로딩중...</div>}>
              <SortDropDown
                sort={sort}
                setSort={setSort}
              />
            </Suspense>
          </div>

          <CardList data={products} />

          {products?.length === 0 ? (
            <div className='absolute flex flex-col items-center justify-center h-auto w-1/2 left-1/2 -translate-x-1/2'>
              <div className='absolute w-full h-40'>
                <Image
                  src={'/img/card/WarningImage.svg'}
                  fill
                  alt='데이터 없음 이미지'
                />
              </div>
              <p className='relative top-[120px] text-2xl text-black-100'>
                상품이 없습니다
              </p>
            </div>
          ) : (
            <MoreButton
              className='w-full flex items-center justify-center my-16'
              onClick={() => {}}
            />
          )}

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
        </div>
      ) : (
        <div className='absolute flex justify-center items-center h-full left-1/2 -translate-x-1/2'>
          <Loader2 className='animate-spin text-gray-500 w-[120px] h-[120px]' />
        </div>
      )}
    </>
  );
}
