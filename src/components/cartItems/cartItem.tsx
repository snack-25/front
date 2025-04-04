'use client';

import Image from 'next/image';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  deliveryFee: number;
  deliveryType: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function CartItem({
  name,
  price,
  quantity,
  total,
  deliveryFee,
  deliveryType,
  checked,
  onToggle,
  onDelete,
}: CartItemProps) {
  return (
    <div className='flex w-[1254px] h-[208px] items-center border-b border-[#C4C4C4] px-6 bg-[#FFFDF9]'>
      <div className='w-[594px] h-[208px] flex justify-between border-b border-[#E6E6E6] p-[24px]'>
        <div className='flex flex-row gap-5'>
          <input
            type='checkbox'
            className='mr-4'
            checked={checked}
            onChange={onToggle}
          />
          <div className='w-[160px] h-[160px] rounded-[16px] bg-white border border-[#E6E6E6] flex items-center justify-center'>
            <Image
              src='/img/card/item-coke-zero.png'
              alt={name}
              width={56}
              height={97.2}
            />
          </div>
        </div>

        <div className='relative flex-1 h-full flex flex-col justify-center'>
          <button
            onClick={onDelete}
            className='absolute top-[24px] right-[24px] cursor-pointer'
          >
            <Image
              src='/icon/X.png'
              alt='삭제 버튼'
              width={14}
              height={14}
            />
          </button>
          <div className='ml-5'>
            <div className='font-normal align-middle'>{name}</div>
            <div className='font-bold text-[24px] text-[#1F1F1F]'>
              {price.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>

      <div className='w-[150px] text-center'>
        <input
          type='number'
          defaultValue={quantity}
          className='w-[80px] text-center border rounded'
        />
      </div>

      <div className='w-[150px] text-center'>
        <div className='font-bold text-lg'>{total.toLocaleString()}원</div>
        <button className='mt-2 bg-orange-400 text-white px-4 py-1 rounded'>
          즉시 구매
        </button>
      </div>

      <div className='w-[150px] text-center text-sm'>
        <div className='font-bold'>{deliveryFee.toLocaleString()}원</div>
      </div>
      <div className='w-[150px] text-center text-sm'>
        <div className='font-bold'>{deliveryType}</div>
      </div>
    </div>
  );
}
