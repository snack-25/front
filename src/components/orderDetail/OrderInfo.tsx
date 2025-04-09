'use client';

import Image from 'next/image';
import { OrderDetailResponse } from '@/types/cart';
import { getCategoryNamePair } from '@/lib/utils/getCategoryNamePair';
import { Category } from '@/components/gnb/TabMenu';

interface Props {
  order: OrderDetailResponse;
  categories: Category[];
}

export default function OrderInfo({ order, categories }: Props) {
  const firstItem = order.orderItems?.[0] || {};
  const totalQuantity =
    order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const category = getCategoryNamePair(categories, firstItem?.categoryId || '');

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
                src={firstItem?.imageUrl || '/img/card/item-coke-zero.png'}
                alt='상품 이미지'
                width={47}
                height={81}
                className='rounded-md border'
              />
            </div>
            <div className='ml-3'>
              <p className='font-medium text-[18px] text-[#1F1F1F]'>
                {order.orderItems.length > 1
                  ? `${firstItem?.productName} 외 ${order.orderItems.length - 1}개`
                  : firstItem?.productName}
              </p>
              <p className='text-[14px] text-gray-500 mt-[2px]'>
                {category.parentName} · {category.childName}
              </p>
            </div>
          </div>

          <div className='flex justify-between items-center mt-1'>
            <p className='text-base font-semibold text-[#1F1F1F]'>
              총 {totalQuantity}개
            </p>
            <p className='text-[18px] font-bold text-[#F97B22]'>
              {order.totalAmount.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
