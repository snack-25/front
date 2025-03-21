'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/app/api/instance';
import { Loader2 } from 'lucide-react';

export interface Category {
  id: string;
  parentId: string | null;
  companyId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TabMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [parents, setParents] = useState<Category[] | null>(null); //상위 카테고리 목록
  const [sub, setSub] = useState<Category[] | null>(null); //하위 카테고리 목록
  const [activeCat, setActiveCat] = useState<string>('cat-스낵'); //활성화된 상위 카테고ㄴ리
  const [activeSub, setActiveSub] = useState<string>('sub-과자'); //활성화된 하위 카테고리

  const getSub = async (parentId: Category['id']) => {
    //하위 카테고리 목록 패칭 함수
    try {
      const sub: Category[] = await fetchApi(
        `/api/categories/parents/${parentId}`,
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

  useEffect(() => {
    const getParents = async () => {
      try {
        const parents: Category[] = await fetchApi('/api/categories/parents', {
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
    getSub(activeCat);
  }, [activeCat]);

  useEffect(() => {
    if (sub) {
      //상위 카테고리가 변했을 때 초기 하위 카테고리를 첫 번째로 지정
      setActiveSub(sub[0].id);
      router.replace(`?categoryId=${sub[0].id}`);
    }
  }, [sub]);

  const handleSub = (subId: string) => {
    setActiveSub(subId);
    router.replace(`?categoryId=${subId}`);
  };

  const handleCat = (cat: string) => {
    setActiveCat(cat);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('sort', 'createdAt:desc');
    router.replace(`?${currentParams.toString()}`);
  };

  const ulStyle =
    'flex h-16 text-gray-400 text-2lg font-medium px-[120px] max-lt:px-6 gap-3 items-center border-b-1 border-line-200 overflow-x-scroll whitespace-nowrap no-scrollbar';
  const buttonStyle =
    'w-full h-full cursor-pointer transition-all duration-300';

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
              <button
                className={cn(
                  buttonStyle,
                  activeCat === parent.id
                    ? 'border-b-1 border-b-primary-400 text-primary-400'
                    : '',
                )}
                onClick={() => handleCat(parent.id)}
              >
                {parent.name}
              </button>
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
              <button
                className={cn(
                  buttonStyle,
                  'text-lg font-semibold',
                  activeSub === item.id ? 'text-primary-400' : '',
                )}
                onClick={() => handleSub(item.id)}
              >
                {item.name}
              </button>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}
