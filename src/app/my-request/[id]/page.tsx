'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

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

// 상태 라벨을 변환하는 함수
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '승인 대기';
    case 'APPROVED':
      return '승인 완료';
    case 'REJECTED':
      return '승인 반려';
    default:
      return status;  // 기본적으로 상태 값 그대로 출력
  }
};

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
        console.log('상세 주문 데이터:', data);

        const transformed: OrderDetail = {
          id: data.id,
          createdAt: data.requestedAt?.slice(0, 10),
          requester: data.requesterName,
          requestMessage: data.items[0]?.requestMessage,
          status: data.status,
          totalAmount: data.totalAmount,
          items: Array.isArray(data.items)
            ? data.items.map((item: any) => ({
                id: item.product?.id ?? '',
                name: item.productName ?? '상품 없음',
                imageUrl: item.imageUrl ?? '/images/default.png',
                category: item.categoryName ?? '',
                price: item.price ?? 0,
                quantity: item.quantity ?? 0,
              }))
            : [],
          approvedAt: data.resolvedAt?.slice(0, 10),
          approver: data.resolverName,
          resultMessage: data.resolverMessage,
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

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const cartId = user.cartId;
  
      if (!cartId) {
        alert('장바구니 정보가 없습니다.');
        return;
      }
  
      const itemsToAdd = order?.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })) || [];
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${cartId}/items`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToAdd }),
      });
  
      if (!res.ok) throw new Error('장바구니 추가 실패');
  
      alert('장바구니에 담았습니다!');
    } catch (err) {
      console.error('장바구니 추가 에러:', err);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  const totalItemCost = order.items.reduce(
  (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
  0
);

// 배송비는 총합에서 상품 금액을 뺀 값, 음수 방지용
const shippingFee = Math.max(0, (order.totalAmount || 0) - totalItemCost);

  return (
    <div className='w-full min-h-screen bg-[#FBF8F4] flex px-16 pt-10 pb-10'>
      <div className='w-2/3 pr-8'>
        <h1 className='text-3xl font-bold'>구매 요청 상세</h1>

        <div className='mt-6 bg-none rounded-md p-6'>
          <h2 className='text-xl font-bold mb-4'>요청 품목</h2>

          <div className='border-2 rounded-md max-h-[400px] overflow-y-auto bg-white'>
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

          {/* 배송비 표기 */}
          <div className='flex justify-end mt-4 text-base text-gray-500'>
          배송비: {shippingFee.toLocaleString()}원
          </div>

          <div className='flex justify-end items-end mt-6 text-xl font-bold text-[#E67E22]'>
            <span className='text-black'>총 {order.items.length}건</span>
            <span className='ml-2'>{order.totalAmount.toLocaleString()} 원</span>
            <span className='ml-2 text-sm text-gray-500 font-normal'>배송비포함</span>
          </div>

          <div className='mt-6 flex justify-center gap-4'>
            <button
              onClick={() => router.push('/my-request')}
              className='flex-1 h-[54px] rounded-lg bg-[#FFF1E8] text-orange-400 font-bold transition-transform duration-200 hover:bg-[#FFE0D4] hover:scale-105'
            >
              목록 보기
            </button>
            <button
              onClick={handleAddToCart}
              className='flex-1 h-[54px] rounded-lg bg-orange-400 text-white font-bold transition-transform duration-200 hover:bg-orange-500 hover:scale-105'
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
                value={getStatusLabel(order.status)}
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
