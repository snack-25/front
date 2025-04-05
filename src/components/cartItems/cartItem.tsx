'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import NumberInput from '@/components/ui/NumberInput';
import { useDebounce } from '@/hooks/cart/useDebounce';
import { createOrder, updateCartItemQuantity } from '@/lib/api/cart';
import { useParams, useRouter } from 'next/navigation';

interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  total: number;
  deliveryFee: number;
  deliveryType: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onQuantityChange?: () => void;
}

export default function CartItem({
  id,
  name,
  productId,
  imageUrl,
  price,
  quantity,
  total,
  deliveryFee,
  deliveryType,
  checked,
  onToggle,
  onDelete,
  onQuantityChange,
}: CartItemProps) {
  const [localQuantity, setLocalQuantity] = useState<number>(quantity);
  const debouncedQuantity = useDebounce(localQuantity, 800);
  const { cartId } = useParams() as { cartId: string };
  const router = useRouter();

  const handleInstantBuy = async () => {
    try {
      await createOrder([
        {
          productId: productId,
          quantity: localQuantity,
        },
      ]);
      alert('주문이 완료되었습니다!');
      router.push('/history');
    } catch (error) {
      console.error('주문 실패:', error);
      alert('주문에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (debouncedQuantity !== quantity) {
      updateCartItemQuantity(cartId, id, debouncedQuantity)
        .then(() => {
          if (onQuantityChange) {
            onQuantityChange();
          }
        })
        .catch((err) => console.error('PATCH 실패:', err));
    }
  }, [debouncedQuantity, cartId, id, quantity, onQuantityChange]);

  return (
    <div className='flex justify-between w-[1250px] h-[208px] items-center border-b border-[#C4C4C4] px-6 bg-[#FFFDF9]'>
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
              src={imageUrl || '/img/card/item-coke-zero.png'}
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
              src='/icon/flat/X.svg'
              alt='삭제 버튼'
              width={36}
              height={36}
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
        <NumberInput
          value={localQuantity}
          onChange={(val) => setLocalQuantity(val)}
          className='mx-auto'
        />
      </div>

      <div className='w-[150px] text-center'>
        <div className='font-bold text-lg'>
          {(price * localQuantity).toLocaleString()}원
        </div>
        <button
          className='mt-2 bg-orange-400 text-white px-4 py-1 rounded'
          onClick={handleInstantBuy}
        >
          즉시 구매
        </button>
      </div>

      <div className='flex flex-col'>
        <div className='w-[150px] text-center text-sm'>
          <div className='font-bold'>{deliveryFee.toLocaleString()}원</div>
        </div>
        <div className='w-[150px] text-center text-sm'>
          <div className='font-bold'>{deliveryType}</div>
        </div>
      </div>
    </div>
  );
}
