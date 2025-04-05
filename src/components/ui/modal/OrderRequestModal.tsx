'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/app/auth/useAuthStore';

// categoryId → 카테고리명 매핑
const CATEGORY_MAP: Record<string, string> = {
  d8031i1djxm1hh5rpmpv2smc: '과자 · 스낵류',
  'other-id-1': '청량 · 탄산음료',
  'other-id-2': '커피 · 차',
};

interface OrderRequestItem {
  productId: string;
  quantity: number;
  productName?: string;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
}

interface OrderRequestModalProps {
  visible: boolean;
  items: OrderRequestItem[];
  shippingFee?: number;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

export default function OrderRequestModal({
  visible,
  items,
  shippingFee = 0,
  onClose,
  onConfirm,
}: OrderRequestModalProps) {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');

  if (!visible) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalProductAmount = items.reduce(
    (sum, item) => sum + item.quantity * (item.price || 0),
    0,
  );
  const finalTotalAmount = totalProductAmount + shippingFee;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
      <div className='bg-[#FFFCF8] rounded-[16px] w-[400px] max-h-[90vh] overflow-y-auto p-6'>
        <h2 className='text-xl font-semibold mb-4'>구매 요청</h2>

        <div className='mb-4'>
          <label className='text-sm font-medium mb-1 block'>요청인</label>
          <input
            type='text'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100'
            value={user?.name || ''}
            disabled
          />
        </div>

        <div className='mb-4 border border-orange-200 rounded p-3'>
          <p className='font-semibold mb-2 text-sm'>요청 품목</p>
          {items.map((item, idx) => (
            <div
              key={idx}
              className='flex justify-between items-start mb-4'
            >
              <div className='flex gap-3'>
                <div className='w-[60px] h-[60px] rounded-[12px] bg-white border border-[#E6E6E6] flex items-center justify-center'>
                  <Image
                    src={item.imageUrl || '/img/card/item-coke-zero.png'}
                    alt='상품 이미지'
                    width={28}
                    height={48}
                  />
                </div>
                <div className='text-sm'>
                  <div className='text-gray-400 text-xs mb-[2px]'>
                    {CATEGORY_MAP[item.categoryId || ''] || '카테고리 없음'}
                  </div>
                  <div className='font-medium mb-[4px]'>{item.productName}</div>
                  <div className='text-xs text-gray-600'>
                    수량: {item.quantity}개
                  </div>
                </div>
              </div>
              <div className='text-right text-sm'>
                <div className='text-gray-600'>
                  {(item.price ?? 0).toLocaleString()}원
                </div>
                <div className='font-semibold mt-1'>
                  {((item.price ?? 0) * item.quantity).toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mb-2 text-sm flex justify-between'>
          <span>상품 금액</span>
          <span>{totalProductAmount.toLocaleString()}원</span>
        </div>
        <div className='mb-2 text-sm flex justify-between'>
          <span>배송비</span>
          <span>{shippingFee.toLocaleString()}원</span>
        </div>
        <div className='mb-4 text-sm font-semibold flex justify-between'>
          <span>총 {totalQuantity}건</span>
          <span className='text-orange-500'>
            {finalTotalAmount.toLocaleString()}원
          </span>
        </div>

        <div className='mb-6'>
          <label className='text-sm font-medium mb-1 block'>요청 메시지</label>
          <textarea
            rows={3}
            placeholder='요청 메시지를 입력해주세요.'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none overflow-y-auto'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className='flex justify-between'>
          <button
            className='flex-1 bg-[#FFF1E9] text-[#1F1F1F] font-bold py-2 rounded mr-2'
            onClick={onClose}
          >
            취소
          </button>
          <button
            className='flex-1 bg-orange-500 text-white font-bold py-2 rounded'
            onClick={() => onConfirm(message)}
          >
            구매 요청하기
          </button>
        </div>
      </div>
    </div>
  );
}
