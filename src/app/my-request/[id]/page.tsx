'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useAuthStore } from '@/app/auth/useAuthStore';
import { showCustomToast } from '@/components/ui/Toast/Toast';

interface OrderItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
  productId: string;
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING': return '승인 대기';
    case 'APPROVED': return '승인 완료';
    case 'REJECTED': return '승인 반려';
    default: return status;
  }
};

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}`, { credentials: 'include' });
      const data = await res.json();
      const transformed: OrderDetail = {
        id: data.id,
        createdAt: data.requestedAt?.slice(0, 10),
        requester: data.requesterName,
        requestMessage: data.items[0]?.requestMessage,
        status: data.status,
        totalAmount: data.totalAmount,
        items: data.items.map((item: any) => ({
          id: item.productId ?? '',
          name: item.productName ?? '상품 없음',
          imageUrl: item.imageUrl ?? '/images/default.png',
          category: item.categoryName ?? '',
          price: item.price ?? 0,
          quantity: item.quantity ?? 0,
        })),
        approvedAt: data.resolvedAt?.slice(0, 10),
        approver: data.resolverName,
        resultMessage: data.resolverMessage,
      };
      setOrder(transformed);
    };
    fetchOrder();
  }, [id]);

  const handleAddToCart = async () => {
    const cartId = user?.cartId;
    if (!cartId) {return alert('장바구니 정보가 없습니다.');}
    for (const item of order!.items) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${cartId}/items`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
      });
    }
    showCustomToast({ label: '🛒 모든 상품을 장바구니에 담았습니다!', variant: 'success' });
  };

  if (!order) {return <div className='text-center py-20'>불러오는 중...</div>;}

  const shippingFee = Math.max(0, order.totalAmount - order.items.reduce((sum, i) => sum + i.price * i.quantity, 0));

  return (
    <div className="w-full min-h-screen bg-[#FBF8F4] px-4 lg:px-16 pt-10 pb-10">
      {/* 💻 데스크탑 전용 */}
      <div className='hidden lg:flex gap-8'>
        <div className='w-2/3'>
          <h1 className='text-3xl font-bold'>구매 요청 상세</h1>

          {/* 요청 품목 */}
          <div className='mt-6 p-6'>
            <h2 className='text-xl font-bold mb-4'>요청 품목</h2>
            <div className='border rounded-md max-h-[400px] overflow-y-auto bg-white'>
              {order.items.map((item, index) => (
                <div key={index} className='flex justify-between items-center p-4 border-b last:border-none'>
                  <div className='flex gap-4'>

                    <img src={item.imageUrl} alt="상품이미지" className='w-14 h-14 rounded-md' />

                    <div>
                      <p className='text-sm text-gray-500'>{item.category}</p>
                      <p className='font-semibold'>{item.name}</p>
                      <p className='text-sm'>수량: {item.quantity}개</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p>{item.price.toLocaleString()}원</p>
                    <p className='font-semibold'>{(item.price * item.quantity).toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-end mt-2 text-gray-500'>배송비: {shippingFee.toLocaleString()}원</div>
            <div className='flex justify-end items-end mt-6 text-xl font-bold text-[#E67E22]'>
              <span className='text-black'>총 {order.items.length}건</span>
              <span className='ml-2'>{order.totalAmount.toLocaleString()} 원</span>
              <span className='ml-2 text-sm font-normal text-gray-500'>배송비포함</span>
            </div>
            <div className='mt-6 flex justify-center gap-4'>
              <button onClick={() => router.push('/my-request')} className='flex-1 h-[54px] bg-[#FFF1E8] text-orange-400 font-bold rounded-lg hover:bg-[#FFE0D4]'>목록 보기</button>
              <button onClick={handleAddToCart} className='flex-1 h-[54px] bg-orange-400 text-white font-bold rounded-lg hover:bg-orange-500'>장바구니에 다시 담기</button>
            </div>
          </div>
        </div>

        {/* 요청/승인 정보 */}
        <div className='w-1/3 space-y-6'>
          <div>
            <h2 className='text-xl font-bold border-b'>요청 정보</h2>
            <p className='mt-2 text-gray-500'>{order.createdAt}</p>
            <label className='block mt-4 text-sm'>요청인</label>
            <input readOnly value={order.requester} className='w-full border px-4 py-3 rounded-md' />
            <label className='block mt-4 text-sm'>요청 메시지</label>
            <textarea readOnly value={order.requestMessage || '요청 메시지가 없습니다.'} className='w-full border px-4 py-3 rounded-md resize-none' rows={3} />
          </div>
          <div>
            <h2 className='text-xl font-bold border-b'>승인 정보</h2>
            <label className='block mt-4 text-sm'>승인일</label>
            <input readOnly value={order.approvedAt || '-'} className='w-full border px-4 py-3 rounded-md' />
            <label className='block mt-4 text-sm'>승인자</label>
            <input readOnly value={order.approver || '-'} className='w-full border px-4 py-3 rounded-md' />
            <label className='block mt-4 text-sm'>상태</label>
            <input readOnly value={getStatusLabel(order.status)} className='w-full border px-4 py-3 rounded-md' />
            <label className='block mt-4 text-sm'>응답 메시지</label>
            <textarea readOnly value={order.resultMessage || ''} className='w-full border px-4 py-3 rounded-md resize-none' rows={3} />
          </div>
        </div>
      </div>

      {/* 📱 모바일/타블렛 전용 */}
      <div className='flex flex-col lg:hidden gap-6'>
        {/* 요청 정보 */}
        <div>
          <h2 className='text-xl font-bold border-b'>요청 정보</h2>
          <p className='mt-2 text-gray-500'>{order.createdAt}</p>
          <label className='block mt-4 text-sm'>요청인</label>
          <input readOnly value={order.requester} className='w-full border px-4 py-3 rounded-md' />
          <label className='block mt-4 text-sm'>요청 메시지</label>
          <textarea readOnly value={order.requestMessage || '요청 메시지가 없습니다.'} className='w-full border px-4 py-3 rounded-md resize-none' rows={3} />
        </div>

        {/* 승인 정보 */}
        <div>
          <h2 className='text-xl font-bold border-b'>승인 정보</h2>
          <label className='block mt-4 text-sm'>승인일</label>
          <input readOnly value={order.approvedAt || '-'} className='w-full border px-4 py-3 rounded-md' />
          <label className='block mt-4 text-sm'>승인자</label>
          <input readOnly value={order.approver || '-'} className='w-full border px-4 py-3 rounded-md' />
          <label className='block mt-4 text-sm'>상태</label>
          <input readOnly value={getStatusLabel(order.status)} className='w-full border px-4 py-3 rounded-md' />
          <label className='block mt-4 text-sm'>응답 메시지</label>
          <textarea readOnly value={order.resultMessage || ''} className='w-full border px-4 py-3 rounded-md resize-none' rows={3} />
        </div>

        {/* 요청 품목 */}
        <div>
          <h2 className='text-xl font-bold border-b'>요청 품목</h2>
          <div className='border rounded-md bg-white'>
            {order.items.map((item, index) => (
              <div key={index} className='flex justify-between items-center p-4 border-b last:border-none'>
                <div className='flex gap-4'>
                  <img src={item.imageUrl} alt="상품이미지" className='w-14 h-14 rounded-md' />

                  <div>
                    <p className='text-sm text-gray-500'>{item.category}</p>
                    <p className='font-semibold'>{item.name}</p>
                    <p className='text-sm'>수량: {item.quantity}개</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p>{item.price.toLocaleString()}원</p>
                  <p className='font-semibold'>{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
          <div className='text-right text-sm text-gray-500 mt-2'>배송비: {shippingFee.toLocaleString()}원</div>
          <div className='flex justify-end mt-3 font-bold text-[#E67E22]'>
            총 {order.items.length}건 {order.totalAmount.toLocaleString()}원 <span className='text-sm text-gray-500 ml-2 font-normal'>배송비 포함</span>
          </div>
        </div>

        {/* 버튼 */}
        <div className='flex gap-4'>
          <button onClick={() => router.push('/my-request')} className='flex-1 h-[48px] rounded-lg bg-[#FFF1E8] text-orange-400 font-bold hover:bg-[#FFE0D4]'>목록 보기</button>
          <button onClick={handleAddToCart} className='flex-1 h-[48px] rounded-lg bg-orange-400 text-white font-bold hover:bg-orange-500'>장바구니 담기</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
