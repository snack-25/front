'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type CategoryType = {
  [key: string]: {
    kor: string;
    items: { kor: string; eng: string }[];
  };
};

const categories: CategoryType = {
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
      { kor: '건감음료', eng: 'health' },
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

export default function TabMenu() {
  const [activeMain, setActiveMain] = useState<string>('snack');
  const [activeSub, setActiveSub] = useState<string>('스낵');
  const [value, setValue] = useState<string>('snack');

  const handleValue = (categoryKey: string, itemKor: string) => {
    const category = categories[categoryKey];
    const engItem =
      category.items.find((item) => item.kor === itemKor)?.eng || '';
    setValue(engItem);
  };

  const ulStyle =
    'flex h-16 text-gray-400 text-2lg font-medium px-[120px] gap-3 items-center border-b-1 border-line-200';
  const buttonStyle =
    'w-full h-full cursor-pointer transition-all duration-300';

  useEffect(() => {
    setActiveSub(categories[activeMain].items[0].kor);
  }, [activeMain]);

  useEffect(() => {
    handleValue(activeMain, activeSub);
  }, [activeSub]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(value);
    }
  }, [value]);

  return (
    <>
      <nav>
        <ul className={ulStyle}>
          {Object.entries(categories).map(([key, category]) => (
            <li
              key={key}
              className='h-full'
            >
              <button
                className={cn(
                  buttonStyle,
                  `${activeMain === key ? 'border-b-1 border-b-primary-400 text-primary-400' : ''}`,
                )}
                onClick={() => setActiveMain(key)}
              >
                {category.kor}
              </button>
            </li>
          ))}
        </ul>

        <ul className={ulStyle}>
          {categories[activeMain].items.map((item) => (
            <li
              key={item.kor}
              className='h-full'
            >
              <button
                className={cn(
                  buttonStyle,
                  'text-lg font-semibold',
                  `${activeSub === item.kor ? 'text-primary-400' : ''}`,
                )}
                onClick={() => setActiveSub(item.kor)}
              >
                {item.kor}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
