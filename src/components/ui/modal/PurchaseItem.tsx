import React from 'react';

interface PurchaseItemProps {
  item: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    imageUrl: string;
  };
}

export default function PurchaseItem({ item }: PurchaseItemProps) {
  return (
    <div className='flex items-start gap-4 p-3 border-b last:border-b-0'>
      {/* 상품 이미지 */}
      <img
        src={item.imageUrl}
        alt={item.name}
        className='w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded-md'
      />

      {/* 상품 정보 */}
      <div className='flex flex-col flex-grow'>
        <span className='text-sm text-gray-500'>{item.category}</span>
        <span className='text-[16px] font-semibold'>{item.name}</span>

        {/* 수량 UI - 이미지 아래 위치 */}
        <span className='text-sm text-gray-500 mt-2'>
          수량: {item.quantity}개
        </span>
      </div>

      {/* 가격 정보 */}
      <div className='text-right'>
        <span className='text-sm text-gray-500'>
          {item.price.toLocaleString()}원
        </span>
        <br />
        <span className='text-lg font-bold'>
          {(item.price * item.quantity).toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
