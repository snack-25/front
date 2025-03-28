'use client';
import { useEffect, useState } from 'react';

import { Category } from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import FloatingButton from '@/components/productList/FloatingButton';
import MoreButton from '@/components/productList/MoreButton';
import { SortDropDown } from '@/components/ui/SortDropDown';
import ProductFormModal from '@/components/ui/modal/ProductFormModal';
import { useFetchProducts } from '@/hooks/product/useFetchProduct';
import CloseButton from '@/components/productList/CloseButton';
import { notFound, useSearchParams } from 'next/navigation';
import EmptyImage from '@/components/productList/EmptyImage';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Loading from '@/components/productList/Loading';

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

export const DEFAULT_SORT = 'createdAt:desc';
export const DEFAULT_PARENTID = 'cat-스낵';
export const DEFAULT_CATEGORYID = 'sub-과자';

export default function ProductList() {
  const isAuthenticated: boolean = true;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchProducts } = useFetchProducts();

  const parentId = searchParams.get('parentId');
  const categoryId = searchParams.get('categoryId');
  const sort: Tsort = searchParams.get('sort') as Tsort;
  const page = Number(searchParams.get('page'));

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<IFetchData | null>(null);

  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    let isChanged: boolean = false;
    if (!sort) {
      newParams.set('sort', DEFAULT_SORT);
      isChanged = true;
    }
    if (!page) {
      newParams.set('page', '1');
      isChanged = true;
    }
    if (isChanged) {
      router.replace(`?${newParams.toString()}`);
    }
  }, []);

  useEffect(() => {
    if (!categoryId || !sort) return;

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
    const newParams = new URLSearchParams(searchParams.toString());
    const newPage = String(page + 1);
    newParams.set('page', newPage);
    router.replace(`?${newParams.toString()}`);
  };

  const handleCloseButton = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', '1');
    router.replace(`?${newParams.toString()}`);
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
      {isLoading ? (
        <Loading size='L' />
      ) : products?.items ? (
        <div className='relative'>
          <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex items-center justify-end'>
            <SortDropDown />
          </div>

          <CardList data={products.items} />

          {products.items.length === 0 ? (
            <EmptyImage />
          ) : products.hasNextPage ? (
            <motion.div
              initial={{ y: 300, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className='w-full flex items-center justify-center my-16 fixed bottom-0'
            >
              <MoreButton onClick={handleMoreButton} />
            </motion.div>
          ) : products.hasPrevPage ? (
            <CloseButton
              className='w-full flex items-center justify-center my-16 fixed bottom-0'
              onClick={handleCloseButton}
            />
          ) : (
            ''
          )}

          {isAuthenticated && ( // 관리자 이상 권한일때만 표시
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{
                x: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.4, ease: 'easeInOut' },
              }}
              className='fixed bottom-[10vh] right-[120px] max-lt:right-6'
            >
              <FloatingButton handleClick={handleOpen} />
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
