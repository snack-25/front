'use client';
import EntryList from '@/components/productEntry/EntryList';
import { mockProductHistory } from '../playground/entryMock';
import { Tsort } from '../productList/page';
import EntryHeader from '@/components/productEntry/EntryHeader';
import { cn } from '@/lib/utils';

const headList: string[] = [
  '등록일',
  '상품명',
  '카테고리',
  '가격',
  '제품 링크',
];

export default function ProductEntry() {
  const datas = mockProductHistory;

  return (
    <>
      <div className='flex flex-col px-[120px] max-lt:px-6 w-full lt:py-10 max-lt:py-[14px]'>
        <EntryHeader />

        <main className='flex flex-col gap-4'>
          <h1 className='max-lt:hidden flex items-center justify-around text-black-100 text-xl font-medium bg-gray-50 h-20 rounded-full border-1 border-gray-200'>
            {headList.map((elem) => (
              <span key={elem}>{elem}</span>
            ))}
          </h1>

          <EntryList products={datas} />
        </main>
      </div>
    </>
  );
}
