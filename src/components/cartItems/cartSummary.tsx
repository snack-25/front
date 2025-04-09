'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartSummaryProps } from '@/types/cart';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { Button } from '../ui/Button';
import { useOrder } from '@/hooks/order/useOrder';
import { showCustomToast } from '../ui/Toast/Toast';

export default function CartSummary({
  cartData,
  summary,
  onOrder,
  selectedIds,
}: CartSummaryProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { submitOrder } = useOrder();

  const totalAmount = summary?.totalAmount ?? 0;
  const shippingFee = summary?.shippingFee ?? 0;
  const totalOrderAmount = totalAmount + shippingFee;

  const originalBudget =
    summary?.originalBudget ?? cartData.originalBudget ?? 0;

  const estimatedRemainingBudget =
    summary?.originalBudget !== undefined
      ? summary.originalBudget - totalOrderAmount
      : originalBudget;

  const handleOrder = async () => {
    if (user?.role === 'USER') {
      onOrder();
    } else {
      if (selectedIds.length === 0) {
        showCustomToast({
          label: '주문할 상품을 선택해주세요.',
          variant: 'error',
        });
        return;
      }

      const selectedItems = cartData.items
        .filter((item) => selectedIds.includes(item.id))
        .map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

      if (selectedItems.length === 0) {
        return;
      }

      await submitOrder(selectedItems);
    }
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <div className='w-full lg:w-[386px] flex-shrink-0 flex flex-col gap-4 mt-6 lg:mt-0'>
      <div className='w-full h-auto lg:h-[384px] flex flex-col gap-[24px] pt-[40px] pr-[24px] pb-[40px] pl-[24px] rounded-[16px] border border-[#F2F2F2] bg-white'>
        <div className='border-b pb-4 mb-4'>
          <div className='flex justify-between mb-2 text-sm'>
            <span className='text-gray-600'>총 주문 상품</span>
            <span className='font-bold text-orange-500'>
              {summary ? `${selectedIds.length}개` : '0개'}
            </span>
          </div>
          <div className='flex justify-between mb-2 text-sm'>
            <span className='text-gray-600'>상품금액</span>
            <span className='font-semibold'>
              {totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>배송비</span>
            <span className='font-semibold'>
              {shippingFee.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className='flex justify-between mb-2 text-base'>
          <span className='text-gray-800 font-bold'>총 주문금액</span>
          <span className='text-orange-500 font-bold text-lg'>
            {totalOrderAmount.toLocaleString()}원
          </span>
        </div>

        <div className='flex justify-between mb-6 text-sm'>
          <span className='text-gray-600'>남은 예산 금액</span>
          <span className='font-semibold'>
            {estimatedRemainingBudget.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Button
          filled='orange'
          width='100%'
          onClick={handleOrder}
        >
          {user?.role === 'USER' ? '구매 요청' : '구매하기'}
        </Button>
        <Button
          outlined='orange'
          width='100%'
          onClick={handleContinueShopping}
        >
          계속 쇼핑하기
        </Button>
      </div>
    </div>
  );
}
