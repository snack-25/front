'use client';

import { useCallback, useEffect, useState } from 'react';
import CartItem from '@/components/cartItems/cartItem';
import { deleteCartItems, getCartItems } from '@/lib/api/cart';
import { CartResponse } from '@/types/cart';
import { useParams } from 'next/navigation';

export default function CartsPage() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { cartId } = useParams() as { cartId: string };

  const fetchCart = useCallback(async () => {
    try {
      const data = await getCartItems(cartId);
      setCartData(data);
    } catch (error) {
      console.error(error);
    }
  }, [cartId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const toggleSelect = (itemId: string) => {
    setSelectedIds((prev) => {
      const updated = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      console.log('✔ 선택된 ID 목록:', updated);
      return updated;
    });
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    try {
      await deleteCartItems(cartId, selectedIds);
      setSelectedIds([]);
      fetchCart();
    } catch (error) {
      console.error(error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteCartItems(cartId, [itemId]);
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
      fetchCart();
    } catch (error) {
      console.error(error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDeleteAll = async () => {
    const allIds = cartData?.items.map((item) => item.id) || [];
    if (allIds.length === 0) return;

    try {
      await deleteCartItems(cartId, allIds);
      setSelectedIds([]);
      fetchCart();
    } catch (error) {
      console.error(error);
      alert('전체 삭제에 실패했습니다.');
    }
  };

  if (!cartData)
    return <div className='text-center py-20'>장바구니 불러오는 중...</div>;

  return (
    <div className='min-h-screen bg-[#F9F6F1] px-[120px] pt-[40px] pb-[80px]'>
      <h1 className='h-[144px] text-[32px] font-semibold mb-10 text-[#1F1F1F]'>
        장바구니
      </h1>

      <div className='flex gap-6'>
        <div className='w-[1254px] h-[850px] bg-white border border-[#FFFDF9] flex flex-col'>
          <div className='flex w-full h-[80px] border-b border-[#C4C4C4] items-center px-6 font-semibold text-sm bg-[#FFFDF9]'>
            <input
              type='checkbox'
              className='mr-4'
            />
            <div className='flex-1'>상품정보</div>
            <div className='w-[150px] text-center'>수량</div>
            <div className='w-[150px] text-center'>주문 금액</div>
            <div className='w-[150px] text-center'>배송 정보</div>
          </div>

          <div className='h-[720px] overflow-y-auto'>
            {cartData.items.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                imageUrl={item?.product?.imageUrl ?? undefined}
                name={item.product.name}
                price={item.product.price}
                quantity={item.quantity}
                total={item.product.price * item.quantity}
                deliveryFee={cartData.shippingFee}
                deliveryType='택배 배송'
                checked={selectedIds.includes(item.id)}
                onToggle={() => toggleSelect(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>

          <div className='flex justify-between px-6 py-4 bg-[#F9F6F1] text-sm text-gray-600 border-t'>
            <button
              className='w-[139px] h-[50px] px-[18px] py-[12px] rounded-full border border-[#E0E0E0] text-[#1F1F1F] cursor-pointer'
              onClick={handleDeleteAll}
            >
              전체 상품 삭제
            </button>
            <button
              className='w-[139px] h-[50px] px-[18px] py-[12px] rounded-full border border-[#E0E0E0] text-[#1F1F1F] cursor-pointer'
              onClick={handleDelete}
            >
              선택 상품 삭제
            </button>
          </div>
        </div>

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
                  {cartData.totalAmount.toLocaleString()}원
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>배송비</span>
                <span className='font-semibold'>
                  {cartData.shippingFee.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className='flex justify-between mb-2'>
              <span className='text-gray-800 font-bold'>총 주문금액</span>
              <span className='text-orange-500 font-bold text-lg'>
                {(cartData.totalAmount + cartData.shippingFee).toLocaleString()}
                원
              </span>
            </div>

            <div className='flex justify-between mb-6'>
              <span className='text-gray-600'>남은 예산 금액</span>
              <span className='font-semibold'>
                {cartData.estimatedRemainingBudget.toLocaleString()}원
              </span>
            </div>
          </div>

          <div>
            <button className='w-full bg-orange-500 text-white py-3 rounded-lg font-bold mb-2'>
              구매하기
            </button>
            <button className='w-full border border-orange-500 text-orange-500 py-3 rounded-lg font-bold'>
              계속 쇼핑하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
