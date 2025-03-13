import Image from 'next/image';

import { IProps } from '@/app/playground/mock';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { categories } from '../gnb/TabMenu';

type cardProps = {
  data: IProps;
};

export default function ProductCard({ data }: cardProps) {
  const {
    productId,
    productImage,
    productName,
    price,
    parentId,
    categoryId,
    purchase,
  } = data;
  const subIndex = categories[parentId].items.findIndex(
    (item) => item.eng === categoryId,
  );
  const subCategory = categories[parentId].items[subIndex].kor;

  return (
    <>
      <Card className='relative w-full bg-background-400 shadow-none border-none py-0 lt:gap-6 max-lt:gap-4'>
        <CardHeader className='bg-white w-auto aspect-square flex items-center justify-center rounded-2xl'>
          <div className='relative w-1/2 h-1/2'>
            <Image
              src={productImage}
              fill
              alt='product Image'
              className='object-contain'
            />
          </div>
        </CardHeader>
        <CardContent className='w-auto p-0'>
          <div className='flex items-center justify-between max-tb:justify-start'>
            <p className='max-tb:hidden font-normal text-gray-500 text-[1vw]'>
              {subCategory}
            </p>
            <p className='text-primary-400 bg-illustration-200 px-2 py-1 w-auto lt:text-lg max-lt:text-xs font-semibold'>
              {purchase}회 구매
            </p>
          </div>
          <h1 className='font-semibold lt:text-xl max-lt:text-md pb-4'>
            {productName}
          </h1>
          <p className='lt:text-3xl max-lt:text-xl font-bold text-black-400'>
            {price}원
          </p>
        </CardContent>
      </Card>
    </>
  );
}
