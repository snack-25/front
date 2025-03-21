'use client';
import { act, Suspense, useCallback, useEffect, useState } from 'react';

import TabMenu, { Category } from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import FloatingButton from '@/components/productList/FloatingButton';
import MoreButton from '@/components/productList/MoreButton';
import { SortDropDown } from '@/components/productList/SortDropDown';
import ProductFormModal from '@/components/ui/modal/ProductFormModal';

import { fetchApi } from '../api/instance';
import Image from 'next/image';
import { Loader2, Router } from 'lucide-react';
import { useFetchProducts } from '@/hooks/product/useFetchProduct';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

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

interface IFetchData {
  items: IProducts[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAuthenticated: boolean = true;

  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<IFetchData | null>(null);
  const fetchProducts = useFetchProducts();

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (!searchParams.get('sort')) {
      currentParams.set('sort', 'createdAt:desc');
      router.replace(`?${currentParams.toString()}`);
    }
  }, [searchParams.get('sort'), router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts(page);
        if (!data) throw new Error('fetchData 없음');

        const { items, hasNextPage, hasPrevPage } = await fetchProducts(page);
        setProducts({ items, hasNextPage, hasPrevPage });
      } catch (err) {
        console.log('상품 목록 가져오기 실패:', err);
      }
    };
    fetchData();
  }, [page, fetchProducts]);

  const handleMoreButton = () => {
    setPage((prev) => prev + 1);
  };

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
            <TabMenu />
          </Suspense>
          <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex  items-center justify-end'>
            <Suspense fallback={<div>로딩중...</div>}>
              <SortDropDown />
            </Suspense>
          </div>

          <CardList data={products.items} />

          {products.items.length == 0 ? (
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
              className='w-full flex items-center justify-center my-16 fixed bottom-0'
              onClick={handleMoreButton}
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
