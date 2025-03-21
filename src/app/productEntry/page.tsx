'use client';
import { useState } from 'react';

import { SortDropDown } from '@/components/productList/SortDropDown';

import { entryMock } from '../playground/entryMock';
import { Tsort } from '../productList/page';

const headList: string[] = [
  '등록일',
  '상품명',
  '카테고리',
  '가격',
  '제품 링크',
];

export default function ProductEntry() {
  const datas = entryMock;
  const [sort, setSort] = useState<Tsort>('createdAt:desc');
  return (
    <>
      <div className='flex flex-col px-[120px] max-lt:px-6 w-full lt:py-10 max-lt:py-[14px]'>
        <div className='flex items-center justify-between pb-10'>
          <h1 className='lt:text-3xl max-lt:text-xl font-semibold text-black-400'>
            상품 등록 내역
          </h1>
          <SortDropDown sort={sort} setSort={setSort} />
        </div>

        <section className='flex flex-col gap-4'>
          <h1 className='max-lt:hidden flex items-center justify-around text-black-100 text-xl font-medium bg-gray-50 h-20 rounded-full border-1 border-gray-200'>
            {headList.map((elem) => (
              <span key={elem}>{elem}</span>
            ))}
          </h1>

          <div className='flex flex-col'>
            {datas.map((data) => (
              <div
                key={data.productId}
                className='flex items-center justify-between px-20 max-lt:px-6 bg-background-400 lt:h-[104px] border-b-1 border-line-200'
              >
                <div></div>
                {/* {Object.entries(data)
                  .filter(([key]) => key !== 'productId')
                  .map(([key, value]) => (
                    <span
                      key={`${data.productId}-${key}`}
                      className={cn(
                        'lt:text-xl max-lt:text-md text-black-100 font-medium',
                        key === 'productName'
                          ? 'font-semibold text-black-200'
                          : '',
                        key === 'productLink' ? 'overflow-ellipsis max-w-[166px]' : '',
                      )}
                    >
                      {key === 'time' ? value.toLocaleDateString() : value}
                    </span>
                  ))} */}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
