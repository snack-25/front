'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

type TMain = 'snack' | 'drink' | 'water' | 'simpleFood' | 'equipment';

type CategoryType = {
  [key in TMain]: {
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

export default function TabMenu() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mainCategory = searchParams.get('mainCategory') || 'snack';
  const subCategory = searchParams.get('subCategory') || 'snack';
  const sort = searchParams.get('sort') || 'newest';

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams();

    params.set('mainCategory', mainCategory);
    params.set(key, value);
    params.set('sort', sort);
    router.replace(`?${params.toString()}`);
  };

  const handleMainChange = (main: string) => {
    const firstSubCategory = categories[main as TMain].items[0].eng;
    const params = new URLSearchParams(searchParams);

    params.set('mainCategory', main);
    params.set('subCategory', firstSubCategory);
    params.set('sort', sort);
    router.replace(`?${params.toString()}`);
  };

  const ulStyle =
    'flex h-16 text-gray-400 text-2lg font-medium px-[120px] gap-3 items-center border-b-1 border-line-200';
  const buttonStyle =
    'w-full h-full cursor-pointer transition-all duration-300';

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
                handleMainChange(key);
              }}
            >
              {category.kor}
            </button>
          </li>
        ))}
      </ul>

      {/* 하위 카테고리 */}
      <ul className={ulStyle}>
        {categories[mainCategory as TMain]?.items.map((item) => (
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
              onClick={() => updateParams('subCategory', item.eng)}
            >
              {item.kor}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
