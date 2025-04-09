'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useAuthStore } from '@/app/auth/useAuthStore';
import NumberInput from '@/components/ui/NumberInput';
import { showCustomToast } from '@/components/ui/Toast/Toast';
import { useDebounce } from '@/hooks/cart/useDebounce';
import { useOrder } from '@/hooks/order/useOrder';
import { useOrderRequest } from '@/hooks/orderRequest/useOrderRequest';
import { updateCartItemQuantity } from '@/lib/api/cart';
import { CartItemProps } from '@/types/cart';

import { Button } from '../ui/Button';
import OrderRequestModal from '../ui/modal/OrderRequestModal';

export default function CartItem({
  id,
  name,
  productId,
  imageUrl,
  price,
  quantity,
  deliveryFee,
  deliveryType,
  checked,
  onToggle,
  onDelete,
  onQuantityChange,
  categoryId,
}: CartItemProps) {
  const [localQuantity, setLocalQuantity] = useState<number>(quantity);
  const [showModal, setShowModal] = useState(false);
  const debouncedQuantity = useDebounce(localQuantity, 800);
  const { cartId } = useParams() as { cartId: string };
  const { user } = useAuthStore();
  const { submitOrderRequest } = useOrderRequest();
  const { submitOrder } = useOrder();

  const handleInstantBuy = async () => {
    if (user?.role === 'USER') {
      setShowModal(true);
      return;
    }

    const success = await submitOrder([
      {
        productId,
        quantity: localQuantity,
      },
    ]);

    if (success) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (debouncedQuantity !== quantity) {
      updateCartItemQuantity(cartId, id, debouncedQuantity)
        .then(() => {
          onQuantityChange?.();
        })
        .catch((err) => {
          showCustomToast({
            label: '수량 변경에 실패했습니다.',
            variant: 'error',
          });
        });
    }
  }, [debouncedQuantity]);

  return (
    <div className='w-full border-b border-[#C4C4C4] bg-[#FFFDF9] px-4 py-4'>
      <div className='block lg:hidden'>
        <div className='flex justify-between items-start mb-2'>
          <input
            type='checkbox'
            checked={checked}
            onChange={onToggle}
          />
          <button
            className='cursor-pointer'
            onClick={onDelete}
          >
            <Image
              src='/icon/flat/X.svg'
              alt='삭제'
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className='flex justify-between gap-4'>
          <div className='w-[100px] h-[100px] border rounded-xl bg-white flex items-center justify-center'>
            <div className='w-[140px] h-[140px] flex justify-center items-center'>
              <Image
                src={imageUrl || '/img/card/item-coke-zero.png'}
                alt={name}
                width={45}
                height={78}
              />
            </div>
          </div>

          <div className='flex-1 flex flex-col justify-between'>
            <div>
              <p className='text-sm text-[#555]'>{name}</p>
              <p className='font-bold text-lg'>{price.toLocaleString()}원</p>
            </div>

            <div className='flex gap-2 mt-2 w-full'>
              <div className='flex-1'>
                <NumberInput
                  value={localQuantity}
                  onChange={(val) => setLocalQuantity(val)}
                  className='h-[64px] min-w-[90px]'
                />
              </div>
              <Button
                filled='orange'
                width='100%'
                onClick={handleInstantBuy}
                className='flex-1 text-sm min-h-[64px] rounded-[12px] px-2 py-2'
              >
                {user?.role === 'USER' ? '즉시 요청' : '즉시 구매'}
              </Button>
            </div>
          </div>
        </div>

        <div className='mt-4 flex justify-between text-sm'>
          <span className='text-[#555]'>주문금액</span>
          <span className='font-bold'>
            {(price * localQuantity).toLocaleString()}원
          </span>
        </div>
      </div>

      <div className='hidden lg:flex justify-between w-[1210px] h-[200px] items-center px-6'>
        <div className='w-[594px] h-[208px] flex justify-between p-[24px]'>
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
            className='mt-2 bg-[#F97B22] text-white hover:bg-orange-500 px-4 py-1 rounded cursor-pointer font-semibold text-[16px]'
            onClick={handleInstantBuy}
          >
            {user?.role === 'USER' ? '즉시 요청' : '즉시 구매'}
          </button>
        </div>

        <div className='flex flex-col w-[150px] text-center text-sm'>
          <div className='font-bold'>{deliveryFee.toLocaleString()}원</div>
          <div className='font-bold'>{deliveryType}</div>
        </div>
      </div>

      <OrderRequestModal
        visible={showModal}
        items={[
          {
            productId,
            quantity: localQuantity,
            price,
            productName: name,
            imageUrl,
            categoryId,
          },
        ]}
        shippingFee={deliveryFee}
        onClose={() => setShowModal(false)}
        onConfirm={async (message) => {
          const success = await submitOrderRequest([
            { productId, quantity: localQuantity, requestMessage: message },
          ]);
          if (success) {setShowModal(false);}
        }}
      />
    </div>
  );
}
