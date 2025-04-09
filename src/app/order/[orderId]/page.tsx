'use client';

import { useParams } from 'next/navigation';
import { useOrderDetail } from '@/hooks/order/useOrderDetail';
import OrderInfo from '@/components/orderDetail/OrderInfo';
import OrderActions from '@/components/orderDetail/OrderActions';
import { useAuthStore } from '@/app/auth/useAuthStore';

export default function OrderDetailPage() {
  const { orderId } = useParams() as { orderId: string };
  const { user } = useAuthStore();
  const { order, categories, loading } = useOrderDetail(orderId);

  if (loading) {
    return <div className='text-center p-10'>로딩 중...</div>;
  }

  if (!order) {
    return (
      <div className='text-center p-10'>주문 정보를 불러오지 못했습니다.</div>
    );
  }

  return (
    <div className='min-h-screen bg-[#FBF8F4] flex flex-col items-center px-4'>
      <div className='w-full max-w-xl mx-auto'>
        <div className='text-center mt-[50px]'>
          <h1 className='text-[32px] text-black font-bold mb-1'>구매 완료</h1>
          <p className='text-[16px] leading-[32px] text-[#ABABAB] font-normal'>
            성공적으로 구매가 완료되었습니다.
          </p>
        </div>

        <OrderInfo
          order={order}
          categories={categories}
        />
        <OrderActions cartId={user?.cartId} />
      </div>
    </div>
  );
}
