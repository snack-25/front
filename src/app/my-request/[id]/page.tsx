// app/my-request/[id]/page.tsx
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();

        const transformed: OrderDetail = {
          id: data.id,
          createdAt: data.createdAt?.slice(0, 10),
          requester: data.requesterName,
          requestMessage: data.requestMessage,
          status: data.status,
          totalAmount: data.totalAmount,
          items: data.items.map((item: any) => ({
            id: item.product?.id ?? '',
            name: item.product?.name ?? '상품 없음',
            imageUrl: item.product?.imageUrl ?? '/images/default.png',
            category: item.product?.categoryName ?? '',
            price: item.price ?? 0,
            quantity: item.quantity ?? 0,
          })),
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

  if (!order) { return <div className="text-center py-20">불러오는 중...</div>;}

  return (
    <div className="w-full px-8 lg:px-16 pt-10 pb-20 bg-[#FBF8F4] min-h-screen flex flex-col gap-8">
      <h1 className="text-[42px] font-bold">구매 요청 내역</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* 좌측: 요청 품목 */}
        <div className="flex-1 bg-white rounded-md shadow-md p-6 max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">요청 품목</h2>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-4 border-b">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded" />
                <div>
                  <p className="text-md font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                </div>
              </div>
              <div className="text-md font-semibold">{(item.price * item.quantity).toLocaleString()}원</div>
            </div>
          ))}
          <div className="flex justify-end mt-4 text-lg font-bold">
            총 {order.items.length}건 {order.totalAmount.toLocaleString()}원
          </div>
        </div>

        {/* 우측: 요청/승인 정보 */}
        <div className="w-full max-w-[380px] flex-shrink-0">
          <div className="bg-white rounded-md shadow-md p-6 space-y-6">
            {/* 요청 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">요청 정보</h3>
              <p className="text-sm text-gray-500">{order.createdAt}</p>
              <input
                className="w-full border rounded p-2 text-sm mt-2"
                readOnly
                value={order.requester}
              />
              <textarea
                className="w-full border rounded p-2 text-sm mt-2"
                rows={3}
                readOnly
                value={order.requestMessage || ''}
              />
            </div>

            {/* 승인 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">승인 정보</h3>
              <p className="text-sm text-gray-500">{order.approvedAt || '-'}</p>
              <input
                className="w-full border rounded p-2 text-sm mt-2"
                readOnly
                value={order.approver || '-'}
              />
              <input
                className="w-full border rounded p-2 text-sm mt-2"
                readOnly
                value={order.status}
              />
              <textarea
                className="w-full border rounded p-2 text-sm mt-2"
                rows={3}
                readOnly
                value={order.resultMessage || ''}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={() => router.back()}
          className="flex-1 h-[54px] rounded bg-[#FFF1E8] text-orange-400 font-bold"
        >
          목록 보기
        </button>
        <button
          onClick={() => alert('장바구니 기능은 아직 미구현입니다.')}
          className="flex-1 h-[54px] rounded bg-orange-400 text-white font-bold"
        >
          장바구니에 다시 담기
        </button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
