'use client';
import { Suspense, useEffect, useState } from 'react';

import TabMenu, { Category } from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import FloatingButton from '@/components/productList/FloatingButton';
import MoreButton from '@/components/productList/MoreButton';
import { SortDropDown } from '@/components/productList/SortDropDown';
import ProductFormModal from '@/components/ui/modal/ProductFormModal';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useFetchProducts } from '@/hooks/product/useFetchProduct';
import CloseButton from '@/components/productList/CloseButton';
import { notFound } from 'next/navigation';
import { useProvider } from '@/components/productList/ProductProvider';
import EmptyImage from '@/components/productList/EmptyImage';

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

const DEBOUNCE_DELAY = 300;

export default function ProductList() {
  const { fetchProducts } = useFetchProducts();
  const { categoryId, setCategoryId, sort, setSort } = useProvider();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAuthenticated: boolean = true;
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<IFetchData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts(page, categoryId, sort);
        if (!data) notFound();

        const { items, hasNextPage, hasPrevPage } = data;

        setProducts((prev) => {
          if (page === 1) {
            return { items, hasNextPage, hasPrevPage };
          }
          return {
            items: prev ? [...prev.items, ...data.items] : items,
            hasNextPage,
            hasPrevPage,
          };
        });
      } catch (err) {
        notFound();
      }
    };
    fetchData();
  }, [page, categoryId, sort, fetchProducts]);

  const handleMoreButton = () => {
    setPage((prev) => prev + 1);
  };

  const handleCloseButton = () => {
    setPage(1);
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
            <TabMenu setPage={setPage} />
          </Suspense>

          <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex  items-center justify-end'>
            <Suspense fallback={<div>로딩중...</div>}>
              <SortDropDown />
            </Suspense>
          </div>

          <CardList data={products.items} />

          {products?.items.length === 0 ? (
            <EmptyImage />
          ) : products?.hasNextPage ? (
            <MoreButton
              className='w-full flex items-center justify-center my-16 fixed bottom-0'
              onClick={handleMoreButton}
            />
          ) : (
            <CloseButton
              className='w-full flex items-center justify-center my-16 fixed bottom-0'
              onClick={handleCloseButton}
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
