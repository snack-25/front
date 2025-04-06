'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { OrderRequestModalProps } from '@/types/cart';

// categoryId → 카테고리명 매핑
const CATEGORY_MAP: Record<string, string> = {
  d8031i1djxm1hh5rpmpv2smc: '과자 · 스낵류',
  'other-id-1': '청량 · 탄산음료',
  'other-id-2': '커피 · 차',
};

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
    <div className='fixed inset-0 bg-black/60 flex justify-center items-center z-99999 px-4 py-2'>
      <div className='bg-[#FFFCF8] rounded-[16px] w-[688px] max-h-[calc(100vh-64px)] overflow-y-auto p-6'>
        <h2 className='font-bold text-[24px] leading-[32px] align-middle text-[#1F1F1F]'>
          구매 요청
        </h2>
        <div className='w-[640px] border border-[#FDE1CD] my-8' />
        <div className='mb-4'>
          <label className='font-semibold text-[24px] leading-[32px] align-middle text-[#1F1F1F]'>
            요청인
          </label>
          <input
            type='text'
            className='w-full rounded-[16px] border border-[#FCC49C]  px-3 py-2 mt-4 text-sm bg-[#FFFCF8]'
            value={user?.name || ''}
            disabled
          />
        </div>
        <p className='font-semibold text-[20px] leading-[32px] align-middle mt-6 text-[#1F1F1F]'>
          요청 품목
        </p>
        <div className='mb-4 border border-[#FCC49C] rounded-[16px] p-3 max-h-[220px] overflow-y-auto'>
          {items.map((item, idx) => (
            <div
              key={idx}
              className='mb-4'
            >
              <div className='flex justify-between'>
                <div className='flex gap-3'>
                  <div className='w-[60px] h-[60px] rounded-[12px] bg-white border border-[#E6E6E6] flex items-center justify-center'>
                    <Image
                      src={item.imageUrl || '/img/card/item-coke-zero.png'}
                      alt='상품 이미지'
                      width={28}
                      height={48}
                    />
                  </div>
                  <div className='text-sm mt-2'>
                    <div className='text-gray-400 text-xs mb-[2px]'>
                      {CATEGORY_MAP[item.categoryId || ''] || '카테고리 없음'}
                    </div>
                    <div className='font-medium text-sm text-[#1F1F1F]'>
                      {item.productName}
                    </div>
                  </div>
                </div>
                <div className='text-[16px] text-right font-semibold text-[#1F1F1F] mt-5'>
                  {(item.price ?? 0).toLocaleString()}원
                </div>
              </div>

              {/* 하단 줄: 수량 / 총금액 */}
              <div className='flex justify-between mt-4'>
                <div className='text-[16px] text-[#1F1F1F] font-semibold'>
                  수량: {item.quantity}개
                </div>
                <div className='text-[24px] font-bold text-[#1F1F1F]'>
                  {((item.price ?? 0) * item.quantity).toLocaleString()}원
                </div>
              </div>
              <div className='w-[600px] border border-[#FDE1CD] my-2' />
            </div>
          ))}
        </div>

        <div className='w-[640px] border border-[#FDE1CD] my-8' />

        <div className='mb-4 text-sm font-semibold flex justify-between'>
          <span className='text-[24px] font-bold text-[#1F1F1F]'>
            총 {totalQuantity}건
          </span>
          <span className='text-[32px] font-bold text-[#F97B22]'>
            {finalTotalAmount.toLocaleString()}원
          </span>
        </div>

        <div className='mb-6'>
          <label className='text-sm font-medium mb-1 block'>요청 메시지</label>
          <textarea
            rows={3}
            placeholder='요청 메시지를 입력해주세요.'
            className='w-full rounded-[16px] border border-[#FCC49C] px-3 py-2 text-sm resize-none overflow-y-auto'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className='flex justify-between'>
          <button
            className='flex-1 bg-[#FDF0DF] h-[64px] text-[#F97B22] font-bold py-2 rounded-[16px] mr-2 cursor-pointer'
            onClick={onClose}
          >
            취소
          </button>
          <button
            className='flex-1 bg-[#F97B22] h-[64px] text-white font-bold py-2 rounded-[16px] cursor-pointer'
            onClick={() => onConfirm(message)}
          >
            구매 요청하기
          </button>
        </div>
      </div>
    </div>
  );
}
