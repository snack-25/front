'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { fetchApi } from '@/app/api/instance';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export interface Category {
  id: string;
  parentId: string | null;
  companyId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ITabMenu {
  setPage?: (page: number) => void;
  setSubLoading?: (value: boolean) => void;
}

export default function TabMenu({ setPage, setSubLoading }: ITabMenu) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parentId');
  const categoryId = searchParams.get('categoryId') || 'sub-과자';
  const [parents, setParents] = useState<Category[]>([]); //상위 카테고리 목록
  const [sub, setSub] = useState<Category[] | null>(null); //하위 카테고리 목록

  const handleLoading = (value: boolean) => {
    if (setSubLoading) setSubLoading(value);
  };

  useEffect(() => {
    const getParents = async () => {
      try {
        // if (!searchParams.get('parentId')) {
        //   const newParams = new URLSearchParams(searchParams.toString());
        //   newParams.set('parentId', 'cat-스낵'); // 초기 상위 카테고리 디폴트값 지정
        //   router.replace(`?${newParams.toString()}`);
        // }

        const parents: Category[] = await fetchApi('/categories/parents', {
          method: 'GET',
        });
        if (process.env.NODE_ENV === 'development') {
          console.log('상위 카테고리 패칭 완료:', parents);
        }
        setParents(parents);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('상위 카테고리 패칭 실패:', err);
        }
      }
    };

    getParents();
  }, []);

  useEffect(() => {
    const getSub = async () => {
      //하위 카테고리 목록 패칭 함수
      try {
        const sub: Category[] = await fetchApi(
          `/categories/parents/${parentId}`,
          { method: 'GET' },
        );
        if (process.env.NODE_ENV === 'development') {
          console.log('초기 하위 카테고리 패칭 완료:', sub);
        }
        setSub(sub);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('초기 하위 카테고리 패칭 실패:', err);
        }
      }
    };
    getSub();
  }, [parentId]);

  useEffect(() => {
    if (!sub || sub.length === 0) return;

    const currentCategoryId = searchParams.get('categoryId');
    const isCurrentValid = sub.some((s) => s.id === currentCategoryId);

    if (!isCurrentValid) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('categoryId', sub[0].id);
      newParams.set('sort', 'createdAt:desc');
      router.replace(`?${newParams.toString()}`);
      return;
    }
  }, [sub]);

  const handleCategory = (level: 'parentId' | 'categoryId', value: string) => {
    handleLoading(true);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(level, value);
    setPage?.(1);

    if (pathName.includes('detail')) {
      router.push(`/productList?${newParams.toString()}`);
    } else {
      router.replace(`?${newParams.toString()}`);
      handleLoading(false);
    }
  };

  const ulStyle =
    'flex h-16 text-gray-400 text-2lg font-medium px-[120px] max-lt:px-6 gap-3 items-center border-b-1 border-line-200 overflow-x-scroll whitespace-nowrap no-scrollbar';
  const buttonStyle =
    'w-full h-full cursor-pointer transition-all duration-75 hover:text-primary-400';

  return (
    <nav>
      {/* 상위 카테고리 */}
      <ul className={ulStyle}>
        {parents === null ? (
          <div className='flex justify-center items-center h-full'>
            <Loader2 className='animate-spin text-gray-500' />
          </div>
        ) : (
          parents.map((parent) => (
            <li
              key={parent.id}
              className='h-full'
            >
              <motion.button
                type='button'
                whileHover={{ scale: 1.15 }}
                style={{ pointerEvents: 'auto' }} // ✅ 명시적으로 허용
                className={cn(
                  buttonStyle,
                  parentId === parent.id
                    ? 'border-b-1 border-b-primary-400 text-primary-400'
                    : '',
                )}
                onClick={() => handleCategory('parentId', parent.id)}
              >
                {parent.name}
              </motion.button>
            </li>
          ))
        )}
      </ul>

      {/* 하위 카테고리 */}
      <ul className={ulStyle}>
        {sub === null ? (
          <div className='flex justify-center items-center h-full'>
            <Loader2 className='animate-spin text-gray-500' />
          </div>
        ) : (
          sub.map((item) => (
            <li
              key={item.id}
              className='h-full'
            >
              <motion.button
                type='button'
                whileHover={{ scale: 1.15 }}
                style={{ pointerEvents: 'auto' }} // ✅ 명시적으로 허용
                className={cn(
                  buttonStyle,
                  'text-lg font-semibold',
                  categoryId === item.id ? 'text-primary-400' : '',
                )}
                onClick={() => handleCategory('categoryId', item.id)}
              >
                {item.name}
              </motion.button>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}
