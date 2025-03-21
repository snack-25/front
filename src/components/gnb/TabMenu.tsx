'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchApi } from '@/app/api/instance';
import { cn } from '@/lib/utils';

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
  activeSub: string;
  setActiveSub: (value: string) => void;
}

export default function TabMenu({ activeSub, setActiveSub }: ITabMenu) {
  //선택된 하위 카테고리 상태
  const [parents, setParents] = useState<Category[] | null>(null); //상위 카테고리 배열
  const [sub, setSub] = useState<Category[] | null>(null); //하위 카테고리 배열
  const [activeCat, setActiveCat] = useState<string>('cat-스낵'); //선택된 상위 카테고리 상태

  const getSub = async (parentId: Category['id']) => {
    try {
      const sub: Category[] = await fetchApi(
        `/api/categories/parents/${parentId}`,
        {
          method: 'GET',
        },
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('초기 하위 카테고리 패칭 완료:', sub);
        setSub(sub);
      }
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
          setParents(parents);
        }
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
      handleSub(sub[0].id);
    }
  }, [sub]);

  const handleSub = (sub: string) => {
    setActiveSub(sub);
  };

  const handleCat = (cat: string) => {
    setActiveCat(cat);
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
                onClick={() => {
                  handleCat(parent.id);
                }}
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
