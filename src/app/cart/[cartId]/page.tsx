'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CartItem from '@/components/cartItems/cartItem';
import {
  createOrder,
  createOrderRequest,
  deleteCartItems,
  getCartItems,
} from '@/lib/api/cart';
import {
  CartResponse,
  CreateOrderRequestItem,
  CreateOrderRequestPayload,
} from '@/types/cart';
import CartSummary from '@/components/cartItems/cartSummary';
import { useAuthStore } from '@/app/auth/useAuthStore';
import OrderRequestModal from '@/components/ui/modal/OrderRequestModal';

export default function CartsPage() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingItems, setPendingItems] = useState<CreateOrderRequestItem[]>(
    [],
  );
  const { cartId } = useParams() as { cartId: string };
  const { user } = useAuthStore();
  const router = useRouter();

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
      return updated;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allIds = cartData?.items.map((item) => item.id) || [];
      setSelectedIds(allIds);
    }
    setSelectAll((prev) => !prev);
  };

  useEffect(() => {
    const allIds = cartData?.items.map((item) => item.id) || [];
    setSelectAll(selectedIds.length === allIds.length && allIds.length > 0);
  }, [selectedIds, cartData]);

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
    if (allIds.length === 0) {
      return;
    }

    try {
      await deleteCartItems(cartId, allIds);
      setSelectedIds([]);
      fetchCart();
    } catch (error) {
      console.error(error);
      alert('전체 삭제에 실패했습니다.');
    }
  };

  const handleOrder = async () => {
    if (selectedIds.length === 0 || !cartData) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }

    const selectedItems = cartData.items
      .filter((item) => selectedIds.includes(item.id))
      .map((item) => ({
        productId: item.product.id ?? item.productId,
        quantity: item.quantity,
        price: item.product.price,
        productName: item.product.name,
        imageUrl: item.product.imageUrl ?? undefined,
        categoryId: item.product.categoryId,
      }));

    if (user?.role === 'SUPERADMIN' || user?.role === 'ADMIN') {
      try {
        await createOrder(selectedItems);
        alert('주문이 완료되었습니다.');
        router.push('/history');
      } catch (error) {
        console.error('주문 실패:', error);
        alert('주문에 실패했습니다.');
      }
    } else {
      setPendingItems(selectedItems);
      setShowModal(true);
    }
  };

  if (!cartData) {
    return <div className='text-center py-20'>장바구니 불러오는 중...</div>;
  }

  return (
    <div className='min-h-screen bg-[#FBF8F4] px-[120px] pt-[40px] pb-[80px] mt-auto'>
      <h1 className='h-[40px] text-[32px] font-semibold mb-10 text-[#1F1F1F]'>
        장바구니
      </h1>

      <div className='flex gap-6'>
        <div className='w-[1254px] h-[850px] bg-[#FBF8F4] border border-[#FFFDF9] flex flex-col'>
          <div className='flex w-full h-[80px] border-b border-[#C4C4C4] items-center px-6 font-semibold text-sm bg-[#FFFDF9]'>
            <input
              type='checkbox'
              className='mr-4'
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <div className='flex flex-row justify-between'>
              <div className='w-[594px] text-center'>상품정보</div>
              <div className='flex flex-row'>
                <div className='w-[200px] text-center'>수량</div>
                <div className='w-[200px] text-center'>주문 금액</div>
                <div className='w-[200px] text-center'>배송 정보</div>
              </div>
            </div>
          </div>

          <div className='h-[720px] overflow-y-auto'>
            {cartData.items.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                productId={item.product.id}
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
                onQuantityChange={fetchCart}
                categoryId={item.product.categoryId}
              />
            ))}
          </div>

          <div className='flex justify-between px-6 py-4 bg-[#F9F6F1] text-sm text-gray-600 border-t'>
            <div className='w-[310px] flex justify-between'>
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
        </div>

        <CartSummary
          cartData={cartData}
          onOrder={handleOrder}
        />

        <OrderRequestModal
          visible={showModal}
          items={pendingItems}
          shippingFee={cartData.shippingFee}
          onClose={() => setShowModal(false)}
          onConfirm={async (message) => {
            if (!user) {
              alert('로그인이 필요합니다.');
              return;
            }

            const payload: CreateOrderRequestPayload = {
              requestMessage: message,
              items: pendingItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
              requesterId: String(user.id),
              companyId: String(user.companyId),
              status: 'PENDING',
            };

            try {
              await createOrderRequest(payload);

              alert('주문 요청이 제출되었습니다.');
              setShowModal(false);
              router.push('/history');
            } catch (error) {
              console.error('요청 실패:', error);
              alert('주문 요청에 실패했습니다.');
            }
          }}
        />
      </div>
    </div>
  );
}
