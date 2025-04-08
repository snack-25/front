'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartSummaryProps } from '@/types/cart';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { Button } from '../ui/Button';

export default function CartSummary({
  cartData,
  summary,
  onOrder,
}: CartSummaryProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleContinueShopping = () => {
    router.push('/');
  };

  const totalAmount = summary?.totalAmount ?? 0;
  const shippingFee = summary?.shippingFee ?? 0;
  const totalOrderAmount = totalAmount + shippingFee;

  const originalBudget =
    summary?.originalBudget ?? cartData.originalBudget ?? 0;

  const estimatedRemainingBudget =
    summary?.originalBudget !== undefined
      ? summary.originalBudget - totalOrderAmount
      : originalBudget;

  return (
    <div className='flex flex-col gap-7'>
      <div className='w-[386px] h-[384px] flex flex-col gap-[24px] pt-[60px] pr-[24px] pb-[60px] pl-[24px] rounded-[16px] border border-[#F2F2F2] bg-white'>
        <div className='border-b pb-4 mb-4'>
          <div className='flex justify-between mb-2'>
            <span className='text-gray-600'>총 주문 상품</span>
            <span className='font-bold text-orange-500'>
              {summary ? `${cartData.items.length}개` : '0개'}
            </span>
          </div>
          <div className='flex justify-between mb-2'>
            <span className='text-gray-600'>상품금액</span>
            <span className='font-semibold'>
              {totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>배송비</span>
            <span className='font-semibold'>
              {shippingFee.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className='flex justify-between mb-2'>
          <span className='text-gray-800 font-bold'>총 주문금액</span>
          <span className='text-orange-500 font-bold text-lg'>
            {totalOrderAmount.toLocaleString()}원
          </span>
        </div>

        <div className='flex justify-between mb-6'>
          <span className='text-gray-600'>남은 예산 금액</span>
          <span className='font-semibold'>
            {estimatedRemainingBudget.toLocaleString()}원
          </span>
        </div>
      </div>

      <div>
        <div>
          <Button
            filled='orange'
            width='100%'
            onClick={onOrder}
            className='mb-2 cursor-pointer'
          >
            {user?.role === 'USER' ? '구매 요청' : '구매하기'}
          </Button>

          <Button
            outlined='orange'
            width='100%'
            onClick={handleContinueShopping}
            className='cursor-pointer'
          >
            계속 쇼핑하기
          </Button>
        </div>
      </div>
    </div>
  );
}
