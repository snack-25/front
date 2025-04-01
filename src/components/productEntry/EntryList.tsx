import Image from 'next/image';
import { Link2 } from 'lucide-react';

import { IProducts } from '@/app/productList/page';

interface IProps {
  items: IProducts[];
}

const headList: string[] = [
  '등록일',
  '상품명',
  '카테고리',
  '가격',
  '제품 링크',
];

export default function EntryList({ items }: IProps) {
  return (
    <>
      <header className='max-lt:hidden min-w-[1200px] grid grid-cols-[150px_390px_1fr_1fr_235px] px-20 max-w-[1680px] h-20 place-items-center text-black-100 text-xl font-medium bg-gray-50 rounded-full border border-gray-200'>
        <span>등록일</span>
        <span>상품명</span>
        <span>카테고리</span>
        <span>가격</span>
        <span>제품 링크</span>
      </header>

      <div className='max-lt:hidden flex flex-col max-w-[1680px] px-20 min-w-[1200px]'>
        {items.map((data) => (
          <div
            key={data.id}
            className=' lt:grid lt:grid-cols-[150px_390px_1fr_1fr_235px] h-[104px] place-items-center text-black-100 text-xl border-b border-line-200 bg-background-400'
          >
            <p>{'2025.03.28'}</p>

            <div className='flex items-center gap-4'>
              <div className='relative w-20 h-20 bg-gray-50 border border-line-200 rounded-lg'>
                <Image
                  src={data.imageUrl}
                  fill
                  alt='등록 상품 이미지'
                  sizes='80px'
                />
              </div>
              <p className='text-black-200 font-semibold'>{data.name}</p>
            </div>

            <p>{'청량/탄산음료'}</p>
            <p>{data.price.toString()}원</p>

            <div className='flex items-center gap-2 w-[166px]'>
              <p className='truncate'>www.codeit.kr</p>
              <div className='w-9 h-9 max-lt:w-6 max-lt:h-6 bg-background-500 flex items-center justify-center rounded-full'>
                <Link2 className='w-6 h-6 max-lt:w-[18px] max-lt:h-[18px] rounded-full text-primary-400 rotate-135' />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='lt:hidden flex border-b-1 border-b-line-200 flex-col'>
        {items.map((data) => (
          <div
            key={data.id}
            className=' border-1 border-b-line-200 flex flex-col'
          >
            <div className='flex items-center justify-start gap-4 px-6 mb:h-[136px] max-mb:h[120px]'>
              <div className='relative w-20 h-20 bg-gray-50 border border-line-200 rounded-lg'>
                <Image
                  src={data.imageUrl}
                  fill
                  alt='등록 상품 이미지'
                />
              </div>
              <div className='h-20'>
                <p className='font-normal text-md text-black-400'>
                  {data.name}
                </p>
                <p className='font-normal text-xs text-gray-500'>
                  {'청량/탄산음료'}
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-2 mx-6 pt-3 pb-8 border-t-1 border-t-line-200 text-gray-500 font-normal text-md'>
              <p className='flex justify-between'>
                <span>등록일</span>
                <span>{'2025.03.28'}</span>
              </p>
              <p className='flex justify-between'>
                <span>가격</span>
                <span>{data.price}</span>
              </p>
              <div className='flex justify-between'>
                <span>제품 링크</span>
                <div className='flex items-center gap-2 w-[130px]'>
                  <p className='truncate'>www.codeit.kr</p>
                  <div className='w-9 h-9 max-lt:w-6 max-lt:h-6 bg-background-500 flex items-center justify-center rounded-full'>
                    <Link2 className='w-6 h-6 max-lt:w-[18px] max-lt:h-[18px] rounded-full text-primary-400 rotate-135' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
