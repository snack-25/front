'use client';
import { Suspense, useEffect, useState } from 'react';

import TabMenu, { Category } from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import FloatingButton from '@/components/productList/FloatingButton';
import MoreButton from '@/components/productList/MoreButton';
import { SortDropDown } from '@/components/productList/SortDropDown';
import ProductFormModal from '@/components/ui/modal/ProductFormModal';
import { Loader2 } from 'lucide-react';
import { useFetchProducts } from '@/hooks/product/useFetchProduct';
import CloseButton from '@/components/productList/CloseButton';
import { notFound, useSearchParams } from 'next/navigation';
import EmptyImage from '@/components/productList/EmptyImage';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parentId');
  const categoryId = searchParams.get('categoryId');
  const sort: Tsort = searchParams.get('sort') as Tsort;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subLoading, setSubLoading] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAuthenticated: boolean = true;
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<IFetchData | null>(null);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (!sort) {
      newParams.set('sort', 'createdAt:desc');
    }
    if (!parentId) {
      newParams.set('parentId', 'cat-스낵');
    }
    if (!categoryId) {
      newParams.set('categoryId', 'sub-과자');
    }
    router.replace(`?${newParams.toString()}`);
  }, []);

  useEffect(() => {
    if(!categoryId || !sort) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts(page, categoryId as string, sort);
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
      } finally {
        setIsLoading(false);
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
      {isLoading || subLoading ? (
        <div className='absolute flex justify-center items-center h-full left-1/2 -translate-x-1/2'>
          <Loader2 className='animate-spin text-gray-500 w-[120px] h-[120px]' />
        </div>
      ) : products?.items ? (
        <div className='relative'>
          <Suspense fallback={<div>로딩중...</div>}>
            <TabMenu
              setPage={setPage}
              setSubLoading={setSubLoading}
            />
          </Suspense>

          <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex items-center justify-end'>
            <Suspense fallback={<div>로딩중...</div>}>
              <SortDropDown />
            </Suspense>
          </div>

          <CardList data={products.items} />

          {products.items.length === 0 ? (
            <EmptyImage />
          ) : products.hasNextPage ? (
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

          {isAuthenticated && ( // 관리자 이상 권한일때만 표시
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className='fixed bottom-[10vh] right-[120px] max-lt:right-6'
            >
              <FloatingButton
                handleClick={handleOpen}
                className=''
              />
            </motion.div>
          )}

          <ProductFormModal
            isOpen={isOpen}
            onClose={handleOpen}
            onConfirm={handleSubmit}
          />
        </div>
      ) : null}
    </>
  );
}
