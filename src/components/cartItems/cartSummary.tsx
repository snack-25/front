'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartSummaryProps } from '@/types/cart';

export default function CartSummary({ cartData, onOrder }: CartSummaryProps) {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <div className='flex flex-col gap-7'>
      <div className='w-[386px] h-[384px] flex flex-col gap-[24px] pt-[60px] pr-[24px] pb-[60px] pl-[24px] rounded-[16px] border border-[#F2F2F2] bg-white'>
        <div className='border-b pb-4 mb-4'>
          <div className='flex justify-between mb-2'>
            <span className='text-gray-600'>총 주문 상품</span>
            <span className='font-bold text-orange-500'>
              {cartData.items.length}개
            </span>
          </div>
          <div className='flex justify-between mb-2'>
            <span className='text-gray-600'>상품금액</span>
            <span className='font-semibold'>
              {(cartData.totalAmount ?? 0).toLocaleString()}원
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>배송비</span>
            <span className='font-semibold'>
              {(cartData.shippingFee ?? 0).toLocaleString()}원
            </span>
          </div>
        </div>

        <div className='flex justify-between mb-2'>
          <span className='text-gray-800 font-bold'>총 주문금액</span>
          <span className='text-orange-500 font-bold text-lg'>
            {(
              (cartData.totalAmount ?? 0) + (cartData.shippingFee ?? 0)
            ).toLocaleString()}
            원
          </span>
        </div>

        <div className='flex justify-between mb-6'>
          <span className='text-gray-600'>남은 예산 금액</span>
          <span className='font-semibold'>
            {(cartData.estimatedRemainingBudget ?? 0).toLocaleString()}원
          </span>
        </div>
      </div>

      <div>
        <button
          className='w-full bg-orange-500 text-white py-3 rounded-lg font-bold mb-2 cursor-pointer'
          onClick={onOrder}
        >
          구매하기
        </button>
        <button
          onClick={handleContinueShopping}
          className='w-full border border-orange-500 text-orange-500 py-3 rounded-lg font-bold cursor-pointer'
        >
          계속 쇼핑하기
        </button>
      </div>
    </div>
  );
}
