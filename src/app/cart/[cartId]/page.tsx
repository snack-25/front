'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CartItem from '@/components/cartItems/cartItem';
import {
  deleteCartItems,
  getCartItems,
  getSelectedCartSummary,
} from '@/lib/api/cart';
import {
  CartResponse,
  CreateOrderRequestItem,
  GetCartSummaryResponse,
} from '@/types/cart';
import CartSummary from '@/components/cartItems/cartSummary';
import { useAuthStore } from '@/app/auth/useAuthStore';
import OrderRequestModal from '@/components/ui/modal/OrderRequestModal';
import { useOrderRequest } from '@/hooks/orderRequest/useOrderRequest';
import { showCustomToast } from '@/components/ui/Toast/Toast';
import { useOrder } from '@/hooks/order/useOrder';

export default function CartsPage() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingItems, setPendingItems] = useState<CreateOrderRequestItem[]>(
    [],
  );
  const [selectedSummary, setSelectedSummary] =
    useState<GetCartSummaryResponse | null>(null);
  const { cartId } = useParams() as { cartId: string };
  const { user } = useAuthStore();
  const router = useRouter();
  const { submitOrderRequest } = useOrderRequest();
  const { submitOrder } = useOrder();

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
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
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

  useEffect(() => {
    const fetchSummary = async () => {
      if (!cartData || selectedIds.length === 0) {
        setSelectedSummary(null);
        return;
      }

      const selectedItems = cartData.items
        .filter((item) => selectedIds.includes(item.id))
        .map((item) => ({
          productId: item.product.id ?? item.productId,
          quantity: item.quantity,
        }));

      try {
        const summary = await getSelectedCartSummary(cartId, selectedItems);
        setSelectedSummary(summary);
      } catch (err) {
        console.error('요약 정보 조회 실패', err);
      }
    };

    fetchSummary();
  }, [selectedIds, cartData, cartId]);

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      showCustomToast({
        label: '삭제할 항목을 선택해주세요.',
        variant: 'error',
      });
      return;
    }

    try {
      await deleteCartItems(cartId, selectedIds);
      setSelectedIds([]);
      fetchCart();
    } catch (error) {
      console.error(error);
      showCustomToast({ label: '삭제에 실패했습니다.', variant: 'error' });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteCartItems(cartId, [itemId]);
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
      fetchCart();
    } catch (error) {
      console.error(error);
      showCustomToast({ label: '삭제에 실패했습니다.', variant: 'error' });
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
      showCustomToast({ label: '전체 삭제에 실패했습니다.', variant: 'error' });
    }
  };

  const handleOrder = async () => {
    if (selectedIds.length === 0 || !cartData) {
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
        price: item.product.price,
        productName: item.product.name,
        imageUrl: item.product.imageUrl ?? undefined,
        categoryId: item.product.categoryId,
      }));

    if (user?.role === 'SUPERADMIN' || user?.role === 'ADMIN') {
      const success = await submitOrder(selectedItems);
      if (success) fetchCart();
    } else {
      setPendingItems(selectedItems);
      setShowModal(true);
    }
  };

  if (!cartData)
    return <div className='text-center py-20'>장바구니 불러오는 중...</div>;

  return (
    <div className='min-h-screen bg-[#FBF8F4] px-4 lg:px-[120px] pt-[40px] pb-[80px] mt-auto'>
      <h1 className='h-[40px] text-[32px] font-semibold mb-10 text-[#1F1F1F]'>
        장바구니
      </h1>

      <div className='w-full flex flex-col lg:flex-row gap-6 lg:min-w-[1254px]'>
        <div className='w-full lg:w-[1254px] bg-[#FBF8F4] border border-[#FFFDF9] flex flex-col'>
          <div className='flex w-full h-[80px] border-b border-[#C4C4C4] items-center px-4 lg:px-6 font-semibold text-sm bg-[#FFFDF9]'>
            <input
              type='checkbox'
              className='mr-2 lg:mr-4'
              checked={selectAll}
              onChange={handleSelectAll}
            />

            <span className='lg:hidden text-sm text-[#1F1F1F]'>전체선택</span>

            <div className='hidden lg:flex flex-row justify-between w-full text-center'>
              <div className='w-[594px]'>상품정보</div>
              <div className='flex flex-row justify-between flex-1'>
                <div className='w-[200px]'>수량</div>
                <div className='w-[200px]'>주문 금액</div>
                <div className='w-[200px]'>배송 정보</div>
              </div>
            </div>
          </div>

          <div className='max-h-[720px] overflow-y-auto'>
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

          <div className='flex justify-between px-4 lg:px-6 py-4 bg-[#F9F6F1] text-sm text-gray-600 border-t'>
            <div className='w-full lg:w-[310px] flex justify-between gap-2'>
              <button
                className='w-1/2 h-[50px] px-[18px] py-[12px] rounded-full border border-[#E0E0E0] text-[#1F1F1F] cursor-pointer'
                onClick={handleDeleteAll}
              >
                전체 상품 삭제
              </button>
              <button
                className='w-1/2 h-[50px] px-[18px] py-[12px] rounded-full border border-[#E0E0E0] text-[#1F1F1F] cursor-pointer'
                onClick={handleDelete}
              >
                선택 상품 삭제
              </button>
            </div>
          </div>
        </div>

        <CartSummary
          cartData={cartData}
          summary={selectedSummary}
          onOrder={handleOrder}
          selectedIds={selectedIds}
        />

        <OrderRequestModal
          visible={showModal}
          items={pendingItems}
          shippingFee={cartData.shippingFee}
          onClose={() => setShowModal(false)}
          onConfirm={async (message) => {
            const itemsWithMessage = pendingItems.map((item) => ({
              ...item,
              requestMessage: message,
            }));
            const success = await submitOrderRequest(itemsWithMessage);
            if (success) {
              setShowModal(false);
              fetchCart();
            }
          }}
        />
      </div>
    </div>
  );
}
