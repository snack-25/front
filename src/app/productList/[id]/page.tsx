'use client';
import { IProps, mockData, parentId } from '@/app/playground/mock';
import TabMenu, { categories, TMain } from '@/components/gnb/TabMenu';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const items = mockData;

export default function ProductDetail() {
  const { id } = useParams();
  const item = items.find((item) => item.productId === id);

  const { productImage, productName, price, purchase, parentId, categoryId } =
    item || {};

  const maincategory = categories[parentId as TMain].kor;
  const subCategory = categories[parentId as TMain].items.find(
    (item) => item.eng === categoryId,
  )?.kor;

  return (
    <>
      <TabMenu />
      <div className='py-6'>
        <div className='flex text-gray-400 text-xl font-medium gap-2'>
          <div>홈</div>
          <ChevronRight className='text-gray-300' />
          <div>{maincategory}</div>
          <ChevronRight className='text-gray-300' />
          <div className='text-black-400'>{subCategory}</div>
        </div>
        <p>{subCategory}</p>
        <h1>{productName}</h1>
        <p>{purchase}회 구매</p>
      </div>
    </>
  );
}
