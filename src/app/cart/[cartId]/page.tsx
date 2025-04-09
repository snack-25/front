'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import { useAuthStore } from '@/app/auth/useAuthStore';
import CartSummary from '@/components/cartItems/cartSummary';
import CartContainer from '@/components/cartItems/CartContainer';
import OrderRequestModal from '@/components/ui/modal/OrderRequestModal';
import { useCart } from '@/hooks/cart/useCart';
import { useOrderRequest } from '@/hooks/orderRequest/useOrderRequest';
import { useOrder } from '@/hooks/order/useOrder';
import { CreateOrderRequestItem } from '@/types/cart';

export default function CartsPage() {
  const { cartId } = useParams() as { cartId: string };
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [pendingItems, setPendingItems] = useState<CreateOrderRequestItem[]>(
    [],
  );
  const { submitOrder } = useOrder();
  const { submitOrderRequest } = useOrderRequest();

  const {
    cartData,
    selectedIds,
    selectAll,
    selectedSummary,
    toggleSelect,
    handleSelectAll,
    handleDelete,
    handleDeleteItem,
    handleDeleteAll,
    fetchCart,
  } = useCart(cartId);

  const handleOrder = async () => {
    if (!cartData || selectedIds.length === 0) return;

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
      if (success) {
        fetchCart();
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
    <div className='min-h-screen bg-[#FBF8F4] px-4 lg:px-[120px] pt-[40px] pb-[80px] mt-auto'>
      <h1 className='h-[40px] text-[32px] font-semibold mb-10 text-[#1F1F1F]'>
        장바구니
      </h1>

      <div className='w-full flex flex-col lg:flex-row gap-6 lg:min-w-[1254px]'>
        <CartContainer
          cartData={cartData}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          handleSelectAll={handleSelectAll}
          selectAll={selectAll}
          handleDelete={handleDelete}
          handleDeleteAll={handleDeleteAll}
          handleDeleteItem={handleDeleteItem}
          fetchCart={fetchCart}
        />
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
