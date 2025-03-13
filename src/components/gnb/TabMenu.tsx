'use client';

import { useEffect } from 'react';

import { cn } from '@/lib/utils';

type CategoryType = {
  [key: string]: {
    kor: string;
    items: { kor: string; eng: string }[];
  };
};

export const categories: CategoryType = {
  snack: {
    kor: '스낵',
    items: [
      { kor: '스낵', eng: 'snack' },
      { kor: '파이', eng: 'pie' },
      { kor: '초콜릿', eng: 'chocolate' },
      { kor: '캔디', eng: 'candy' },
      { kor: '젤리', eng: 'jelly' },
    ],
  },
  drink: {
    kor: '음료',
    items: [
      { kor: '청량・탄산음료', eng: 'soda' },
      { kor: '과즙 음료', eng: 'juice' },
      { kor: '에너지음료', eng: 'energy' },
      { kor: '커피', eng: 'coffee' },
      { kor: '건강음료', eng: 'health' },
      { kor: '티', eng: 'tea' },
    ],
  },
  water: {
    kor: '생수',
    items: [
      { kor: '생수', eng: 'water' },
      { kor: '스파클링', eng: 'sparkling' },
    ],
  },
  simpleFood: {
    kor: '간편식',
    items: [
      { kor: '면류', eng: 'noodle' },
      { kor: '과일', eng: 'fruit' },
      { kor: '밥', eng: 'rice' },
      { kor: '시리얼', eng: 'cereal' },
      { kor: '빵', eng: 'bread' },
    ],
  },
  equipment: {
    kor: '비품',
    items: [
      { kor: '생활용품', eng: 'life' },
      { kor: '사무용품', eng: 'office' },
      { kor: '친환경', eng: 'eco' },
    ],
  },
};

interface IProps {
  mainCategory: string;
  subCategory: string;
  setMain: (value: string) => void;
  setSub: (value: string) => void;
}

export default function TabMenu({
  mainCategory,
  subCategory,
  setMain,
  setSub,
}: IProps) {
  const ulStyle =
    'flex h-16 text-gray-400 text-2lg font-medium px-[120px] gap-3 items-center border-b-1 border-line-200';
  const buttonStyle =
    'w-full h-full cursor-pointer transition-all duration-300';

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('상위 카테고리:', mainCategory);
      console.log('하위 카테고리:', subCategory);
    }
  }, [subCategory]);

  return (
    <nav>
      {/* 상위 카테고리 */}
      <ul className={ulStyle}>
        {Object.entries(categories).map(([key, category]) => (
          <li
            key={key}
            className='h-full'
          >
            <button
              className={cn(
                buttonStyle,
                mainCategory === key
                  ? 'border-b-1 border-b-primary-400 text-primary-400'
                  : '',
              )}
              onClick={() => {
                setMain(key);
                setSub(categories[key].items[0].eng); // 상위 카테고리 변경시 하위 카테고리 첫번째를 디폴트
              }}
            >
              {category.kor}
            </button>
          </li>
        ))}
      </ul>

      {/* 하위 카테고리 */}
      <ul className={ulStyle}>
        {categories[mainCategory]?.items.map((item) => (
          <li
            key={item.kor}
            className='h-full'
          >
            <button
              className={cn(
                buttonStyle,
                'text-lg font-semibold',
                subCategory === item.eng ? 'text-primary-400' : '',
              )}
              onClick={() => setSub(item.eng)}
            >
              {item.kor}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
