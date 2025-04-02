'use client';

import { CheckIcon,ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

import { Listbox } from '@headlessui/react';

const mainCategories = [
  '스낵',
  '음료',
  '생수',
  '간편식',
  '신선식품',
  '원두커피',
  '비품',
];

const subCategories: Record<string, string[]> = {
  스낵: ['과자', '쿠키', '초콜릿류', '젤리류'],
  음료: ['탄산음료', '과즙음료', '커피'],
  생수: ['생수', '스파클링'],
  간편식: ['컵라면', '핫도그', '계란'],
  신선식품: ['샐러드', '도시락'],
  원두커피: ['드립커피', '원두'],
  비품: ['생활용품', '일회용품'],
};

export default function CategorySelect({
  onCategoryChange,
  onSubCategoryChange,
}: {
  onCategoryChange: (cat: string) => void;
  onSubCategoryChange: (sub: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSub, setSelectedSub] = useState('');

  return (
    <div className='flex gap-2 w-[327px] md:w-[640px] h-[52px] md:h-[64px]'>
      {/* 대분류 */}
      <Listbox
        value={selectedCategory}
        onChange={(val) => {
          setSelectedCategory(val);
          setSelectedSub('');
          onCategoryChange(val);
        }}
      >
        <div className='relative w-1/2'>
          <Listbox.Button
            as='button'
            className='flex items-center justify-between w-full h-full px-[14px] rounded-[16px] border border-[#FCC49C] bg-white text-left'
          >
            <span className='text-gray-400 text-[16px]'>
              {selectedCategory || '대분류'}
            </span>
            <ChevronDownIcon className='w-4 h-4 text-orange-500' />
          </Listbox.Button>
          <Listbox.Options
            as='ul'
            className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white z-50 shadow-md'
          >
            {mainCategories.map((cat) => (
              <Listbox.Option
                as='li'
                key={cat}
                value={cat}
                className={({ active }) =>
                  `px-4 py-2 cursor-pointer ${active ? 'bg-orange-100' : ''}`
                }
              >
                {({ selected }) => (
                  <span className='flex justify-between items-center text-sm'>
                    {cat}
                    {selected && (
                      <CheckIcon className='w-4 h-4 text-orange-500' />
                    )}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {/* 소분류 */}
      {/* 소분류 */}
      <Listbox
        value={selectedSub}
        onChange={(val) => {
          setSelectedSub(val);
          onSubCategoryChange(val);
        }}
      >
        <div className='relative w-1/2'>
          <Listbox.Button
            as='button'
            className={`flex items-center justify-between w-full h-full px-[14px] rounded-[16px] border ${
              selectedCategory ? 'border-[#FCC49C]' : 'border-gray-300'
            } bg-white text-left`}
          >
            <span className='text-gray-400 text-[16px]'>
              {selectedSub || '소분류'}
            </span>
            <ChevronDownIcon className='w-4 h-4 text-orange-500' />
          </Listbox.Button>

          <Listbox.Options
            as='ul'
            className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white z-50 shadow-md'
          >
            {!selectedCategory ? (
              <li className='px-4 py-2 text-gray-400 cursor-not-allowed'>
                대분류를 먼저 선택해주세요
              </li>
            ) : (
              subCategories[selectedCategory].map((sub) => (
                <Listbox.Option
                  as='li'
                  key={sub}
                  value={sub}
                  className={({ active }) =>
                    `px-4 py-2 cursor-pointer ${active ? 'bg-orange-100' : ''}`
                  }
                >
                  {({ selected }) => (
                    <span className='flex justify-between items-center text-sm'>
                      {sub}
                      {selected && (
                        <CheckIcon className='w-4 h-4 text-orange-500' />
                      )}
                    </span>
                  )}
                </Listbox.Option>
              ))
            )}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
