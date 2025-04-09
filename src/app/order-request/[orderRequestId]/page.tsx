'use client';

import { useParams } from 'next/navigation';
import OrderRequestInfo from '@/components/orderRequestDetail/OrderRequestInfo';
import OrderRequestActions from '@/components/orderRequestDetail/OrderRequestActions';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { useOrderRequestDetail } from '@/hooks/orderRequest/useOrderRequestDetail';

export default function OrderRequestCompletePage() {
  const { orderRequestId } = useParams() as { orderRequestId: string };
  const { user } = useAuthStore();
  const { data, categories, loading } = useOrderRequestDetail(orderRequestId);

  if (loading) {
    return <div className='text-center p-10'>로딩 중...</div>;
  }

  if (!data) {
    return <div className='text-center p-10'>데이터 없음</div>;
  }

  return (
    <div className='min-h-screen bg-[#FBF8F4] flex flex-col items-center px-4'>
      <div className='w-full max-w-xl mx-auto'>
        <div className='text-center mt-[50px]'>
          <h1 className='text-[32px] text-black font-bold mb-1'>
            구매 요청 완료
          </h1>
          <p className='text-[16px] leading-[32px] text-[#ABABAB] font-normal'>
            관리자에게 성공적으로 구매 요청이 완료되었습니다.
          </p>
        </div>

        <OrderRequestInfo
          data={data}
          categories={categories}
        />
        <OrderRequestActions cartId={user?.cartId} />
      </div>
    </div>
  );
}
