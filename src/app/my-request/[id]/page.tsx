'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  id: string;
  createdAt: string;
  requester: string;
  requestMessage?: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  approvedAt?: string;
  approver?: string;
  resultMessage?: string;
}

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}`,
          {
            credentials: 'include',
          },
        );
        const data = await res.json();

        const transformed: OrderDetail = {
          id: data.id,
          createdAt: data.createdAt?.slice(0, 10),
          requester: data.requesterName,
          requestMessage: data.requestMessage,
          status: data.status,
          totalAmount: data.totalAmount,
          items: Array.isArray(data.items)
            ? data.items.map((item: any) => ({
                id: item.product?.id ?? '',
                name: item.product?.name ?? '상품 없음',
                imageUrl: item.product?.imageUrl ?? '/images/default.png',
                category: item.product?.categoryName ?? '',
                price: item.price ?? 0,
                quantity: item.quantity ?? 0,
              }))
            : [],
          approvedAt: data.approvedAt?.slice(0, 10),
          approver: data.approverName,
          resultMessage: data.resultMessage,
        };
        setOrder(transformed);
      } catch (err) {
        console.error('상세 조회 실패:', err);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className='text-center py-20'>불러오는 중...</div>;
  }

  const totalCost = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className='w-full min-h-screen bg-[#FBF8F4] flex px-16 pt-10 pb-10'>
      <div className='w-2/3 pr-8'>
        <h1 className='text-3xl font-bold'>구매 요청 상세</h1>

        <div className='mt-6 bg-white rounded-md p-6 border-2'>
          <h2 className='text-xl font-bold mb-4'>요청 품목</h2>

          <div className='border rounded-md max-h-[400px] overflow-y-auto'>
            {order.items.map((item, index) => (
              <div
                key={index}
                className='flex justify-between items-center p-4 border-b last:border-none'
              >
                <div className='flex items-center gap-4'>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className='w-14 h-14 rounded-md'
                  />
                  <div>
                    <p className='text-sm text-gray-500'>{item.category}</p>
                    <p className='text-lg font-semibold'>{item.name}</p>
                    <p className='text-sm font-semibold'>수량: {item.quantity}개</p>
                  </div>
                </div>
                <div className='flex flex-col items-end gap-1'>
                  <p>{item.price.toLocaleString()}원</p>
                  <p className='text-lg font-semibold'>
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-end mt-6 text-xl font-bold text-[#E67E22]'>
            <span className='text-black'>총 {order.items.length}건</span>
            <span className='ml-2'>{totalCost.toLocaleString()}원</span>
          </div>

          <div className='mt-6 flex justify-center gap-4'>
            <button
              onClick={() => router.push('/my-request')}
              className='flex-1 h-[54px] rounded bg-[#FFF1E8] text-orange-400 font-bold'
            >
              목록 보기
            </button>
            <button
              onClick={() => alert('장바구니 기능은 아직 미구현입니다.')}
              className='flex-1 h-[54px] rounded bg-orange-400 text-white font-bold'
            >
              장바구니에 다시 담기
            </button>
          </div>
        </div>
      </div>

      <div className='w-1/3 px-8'>
        <div className='bg-[#FBF8F4] rounded-md p-6'>
          <h2 className='text-xl font-bold border-b-2 border-black-100'>요청 정보</h2>
          <p className='text-xl text-gray-400 mt-2'>{order.createdAt}</p>

          <div className='mt-2'>
            <label className='block text-xl font-semibold text-black-400'>요청인</label>
            <input
              type='text'
              value={order.requester ?? ''}
              readOnly
              className='mt-1 w-full rounded-md border-2 text-lg pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500'
            />
          </div>

          <div className='mt-4'>
            <label className='block text-xl font-semibold text-black-400'>요청 메시지</label>
            <textarea
              value={order.requestMessage || '요청 메시지가 없습니다.'}
              readOnly
              rows={2}
              className='mt-1 w-full rounded-md border-2 text-lg resize-none pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500'
            />
          </div>
        </div>

        <div className='bg-[#FBF8F4] rounded-md p-6 mt-6'>
          <h2 className='text-xl font-bold border-b-2 border-black-100'>승인 정보</h2>

          <div className='mt-4 space-y-4'>
            <div>
              <label className='block font-semibold text-black-400 text-xl'>승인일</label>
              <input
                value={order.approvedAt || '-'}
                readOnly
                className='mt-1 w-full rounded-md border-2 px-4 py-3 text-gray-500'
              />
            </div>

            <div>
              <label className='block font-semibold text-black-400 text-xl'>승인자</label>
              <input
                value={order.approver || '-'}
                readOnly
                className='mt-1 w-full rounded-md border-2 px-4 py-3 text-gray-500'
              />
            </div>

            <div>
              <label className='block font-semibold text-black-400 text-xl'>상태</label>
              <input
                value={order.status}
                readOnly
                className='mt-1 w-full rounded-md border-2 px-4 py-3 text-gray-500'
              />
            </div>

            <div>
              <label className='block font-semibold text-black-400 text-xl'>응답 메시지</label>
              <textarea
                value={order.resultMessage || ''}
                readOnly
                rows={3}
                className='mt-1 w-full rounded-md border-2 resize-none px-4 py-3 text-gray-500'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;