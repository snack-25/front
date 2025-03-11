'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type Tcategory = Record<string, string[]>;

const category: Tcategory = {
  snack: ['snack', 'pie', 'chocolate', 'candy', 'jelly'],
  drink: ['soda', 'juice', 'energy', 'coffee', 'health', 'tea'],
  water: ['water', 'sparkling'],
  simpleFood: ['noodle', 'fruit', 'rice', 'cereal', 'bread'],
  equipment: ['life', 'office', 'eco'],
};

const categoryKOR: Tcategory = {
  스낵: ['스낵', '파이', '초콜릿', '캔디', '젤리'],
  음료: ['청량・탄산음료', '과즙 음료', '에너지음료', '커피', '건감음료', '티'],
  생수: ['생수', '스파클링'],
  간편식: ['면류', '과일', '밥', '시리얼', '빵'],
  비품: ['생활용품', '사무용품', '친환경'],
};

const categoryMap: Record<string, keyof Tcategory> = {
  스낵: 'snack',
  음료: 'drink',
  생수: 'water',
  간편식: 'simpleFood',
  비품: 'equipment',
};

export default function TabMenu() {
  const [activeKey, setActiveKey] = useState<string>('스낵');
  const [activeUnder, setActiveUnder] = useState<string>('스낵');
  const [value, setValue] = useState<string>('snack');

  const handleValue = (korKey: string, item: string) => {
    const engKey: string = categoryMap[korKey];
    const engIndex: number = categoryKOR[korKey].indexOf(item);
    const engItem: string = category[engKey][engIndex];
    setValue(engItem);
  };

  const ulStyle =
    'flex h-16 text-gray-400 text-2lg font-medium px-[120px] gap-3 items-center border-b-1 border-line-200';

  const buttonStyle =
    'w-full h-full cursor-pointer transition-all duration-300';

  useEffect(() => {
    const firstItem = categoryKOR[activeKey][0];
    setActiveUnder(firstItem);
  }, [activeKey]);

  useEffect(() => {
    handleValue(activeKey, activeUnder);
  }, [activeUnder]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(value);
    }
  }, [value]);

  return (
    <>
      <nav>
        <ul className={ulStyle}>
          {Object.entries(categoryKOR).map(([korKey]) => (
            <li
              key={korKey}
              className='h-full'
            >
              <button
                className={cn(
                  buttonStyle,
                  `${activeKey === korKey ? 'border-b-1 border-b-primary-400 text-primary-400' : ''}`,
                )}
                onClick={() => {
                  setActiveKey(korKey);
                }}
              >
                {korKey}
              </button>
            </li>
          ))}
        </ul>

        <ul className={ulStyle}>
          {categoryKOR[activeKey].map((item) => (
            <li
              key={item}
              className='h-full'
            >
              <button
                className={cn(
                  buttonStyle,
                  'text-lg font-semibold',
                  `${activeUnder === item ? 'text-primary-400' : ''}`,
                )}
                onClick={() => setActiveUnder(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
