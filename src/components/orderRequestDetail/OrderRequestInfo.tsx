'use client';

import Image from 'next/image';
import { Category } from '@/components/gnb/TabMenu';
import { getCategoryNamePair } from '@/lib/utils/getCategoryNamePair';
import { OrderRequestDetail } from '@/types/cart';

interface OrderRequestProps {
  data: OrderRequestDetail;
  categories: Category[];
}

export default function OrderRequestInfo({
  data,
  categories,
}: OrderRequestProps) {
  if (!data.items.length) {
    return <p className='text-center p-4'>주문 상품 정보가 없습니다 .</p>;
  }

  const firstItem = data.items[0];
  const totalQuantity = data.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const category = getCategoryNamePair(categories, firstItem.categoryId || '');

  return (
    <>
      <p className='text-[24px] font-bold text-[#1F1F1F] mb-4 mt-[70px]'>
        상품정보
      </p>

      <div className='w-full bg-[#FBF8F4] border-y-2 border-[#E6E6E6] px-6 py-6 mb-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <div className='w-[120px] h-[120px] flex justify-center items-center border border-[#E6E6E6] rounded-[16px]'>
              <Image
                src={firstItem.imageUrl || '/img/card/item-coke-zero.png'}
                alt='상품 이미지'
                width={47}
                height={81}
                className='rounded-md border'
              />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-[#1F1F1F]'>
                {data.items.length > 1
                  ? `${firstItem.productName} 외 ${data.items.length - 1}개`
                  : firstItem.productName}
              </p>
              <p className='text-xs text-gray-400 mt-[2px]'>
                {category.parentName} · {category.childName}
              </p>
            </div>
          </div>

          <div className='flex justify-between items-center mt-1'>
            <p className='text-base font-semibold text-[#1F1F1F]'>
              총 {totalQuantity}개
            </p>
            <p className='text-[18px] font-bold text-[#F97B22]'>
              {data.totalAmount.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

      <div className='w-full bg-[#FBF8F4] border-y-2 border-[#E6E6E6] p-6 mb-6'>
        <p className='text-sm font-semibold text-[#1F1F1F] mb-2'>요청 메시지</p>
        <textarea
          readOnly
          value={data.resolverMessage || '요청 메시지가 없습니다.'}
          className='w-full h-[100px] p-3 rounded-[16px] border-2 border-[#F1ECE7] text-[#999999] text-[18px] leading-[26px] font-normal resize-none bg-[#FBF8F4]'
        />
      </div>
    </>
  );
}
