'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface OrderDetail {
  id: string;
  date: string;
  items: OrderItem[];
  requester: string;
  handler: string;
  requestDate: string;
  message?: string;
  totalAmount: number;
  approvalMessage?: string;
}

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
          { credentials: 'include' },
        );
        const data = await res.json();

        const transformed: OrderDetail = {
          id: data.id ?? id,
          date: data.updatedAt?.slice(0, 10) ?? '-',
          requestDate: data.createdAt?.slice(0, 10) ?? '-',
          requester: data.requestedBy?.name ?? '-',
          handler: data.updatedBy?.name ?? '-',
          message: data.notes ?? '',
          approvalMessage: data.adminNotes ?? '',
          totalAmount: data.totalAmount ?? 0,
          items: (data.orderItems || []).map((item: any) => ({
            id: item.productId,
            name: item.productName ?? '상품 없음',
            category: item.CategoryName ?? '기타',
            imageUrl: item.imageUrl ?? '/images/default.png',
            quantity: item.quantity ?? 0,
            price: item.price ?? 0,
          })),
        };

        setOrder(transformed);
      } catch (err) {
        console.error('상세 내역 가져오기 실패:', err);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const totalItemCost = order?.items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0,
  );

  const shippingFee = Math.max(
    0,
    (order?.totalAmount || 0) - (totalItemCost || 0),
  );

  return (
    <div className='w-full min-h-screen bg-[#FBF8F4] px-4 lg:px-16 pt-10 pb-10'>
      {/* 💻 데스크탑 */}
      <div className='hidden lg:flex gap-8'>
        <div className='w-2/3 pr-8'>
          <h1 className='text-3xl font-bold'>구매 내역 상세</h1>
          <div className='mt-6 bg-none rounded-md p-6'>
            <h2 className='text-xl font-bold mb-4'>구매 품목</h2>
            <div className='border rounded-md max-h-[400px] overflow-y-auto bg-white'>
              {order?.items.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center p-4 border-b last:border-none'
                >
                  <div className='flex items-center gap-4'>
                    <img
                      src={item.imageUrl || '/images/default-product.png'}
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
                    <p className=''>{item.price.toLocaleString()}원</p>
                    <p className='text-lg font-semibold'>
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-end mt-4 text-base text-gray-500'>
              배송비: {shippingFee.toLocaleString()}원
            </div>
            <div className='flex justify-end items-end mt-6 text-xl font-bold text-[#E67E22]'>
              <span className='text-black'>총 {order?.items.length}건</span>
              <span className='ml-2'>{order?.totalAmount.toLocaleString()} 원</span>
              <span className='ml-2 text-sm text-gray-500 font-normal'>배송비포함</span>
            </div>
          </div>
        </div>

        <div className='w-1/3 px-6'>
          <div className='p-6 rounded-md'>
            <h2 className='text-xl font-bold border-b-2 border-black-100'>요청 정보</h2>
            <p className='text-xl text-gray-400 mt-2'>
              {new Date(order?.requestDate || '').toLocaleDateString('ko-KR')}
            </p>
            <label className='block mt-4 text-xl font-semibold text-black-400'>요청인</label>
            <input
              type='text'
              value={order?.requester ?? ''}
              readOnly
              className='mt-1 w-full rounded-md border-2 text-2lg pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500'
            />
            <label className='block mt-4 text-xl font-semibold text-black-400'>요청 메시지</label>
            <textarea
              value={order?.message ?? ''}
              readOnly
              rows={2}
              className='mt-1 w-full rounded-md border-2 text-2lg resize-none pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500'
            />
          </div>

          <div className='p-6 mt-6 rounded-md'>
            <h2 className='text-xl font-bold border-b-2 border-black-100'>승인 정보</h2>
            <p className='text-xl text-gray-400 mt-2'>
              {new Date(order?.requestDate || '').toLocaleDateString('ko-KR')}
            </p>
            <label className='block mt-4 text-xl font-semibold text-black-400'>담당자</label>
            <input
              type='text'
              value={order?.handler ?? ''}
              readOnly
              className='mt-1 w-full rounded-md border-2 text-2lg pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500'
            />
            <label className='block mt-4 text-xl font-semibold text-black-400'>승인 메시지</label>
            <textarea
              value={order?.approvalMessage ?? ''}
              readOnly
              rows={1}
              className='mt-1 w-full rounded-md border-2 text-2lg resize-none pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500'
            />
          </div>
        </div>
      </div>

     {/* 📱 모바일/타블렛 전용 */}
<div className='flex flex-col lg:hidden gap-6'>
  {/* 요청 정보 */}
  <div>
    <h2 className='text-xl font-bold border-b-2 border-black-100'>요청 정보</h2>
    <p className='mt-2 text-gray-500'>{order?.requestDate}</p>
    <label className='block mt-4 text-lg font-semibold'>요청인</label>
    <input
      readOnly
      value={order?.requester ?? ''}
      className='w-full border px-4 py-3 rounded-md text-gray-500'
    />
    <label className='block mt-4 text-lg font-semibold'>요청 메시지</label>
    <textarea
      readOnly
      value={order?.message ?? ''}
      className='w-full border px-4 py-3 rounded-md resize-none text-gray-500'
      rows={3}
    />
  </div>

  {/* 승인 정보 */}
  <div>
    <h2 className='text-xl font-bold border-b-2 border-black-100'>승인 정보</h2>
    <p className='mt-2 text-gray-500'>{order?.date}</p>
    <label className='block mt-4 text-lg font-semibold'>담당자</label>
    <input
      readOnly
      value={order?.handler ?? ''}
      className='w-full border px-4 py-3 rounded-md text-gray-500'
    />
    <label className='block mt-4 text-lg font-semibold'>승인 메시지</label>
    <textarea
      readOnly
      value={order?.approvalMessage ?? ''}
      className='w-full border px-4 py-3 rounded-md resize-none text-gray-500'
      rows={3}
    />
  </div>

  {/* 구매 품목 */}
  <div>
    <h2 className='text-xl font-bold border-b'>구매 품목</h2>
    <div className='border rounded-md bg-white'>
      {order?.items.map((item, index) => (
        <div
          key={index}
          className='flex justify-between items-center p-4 border-b last:border-none'
        >
          <div className='flex gap-4'>
            <img
              src={item.imageUrl || '/images/default-product.png'}
              alt='상품이미지'
              className='w-14 h-14 rounded-md'
            />
            <div>
              <p className='text-sm text-gray-500'>{item.category}</p>
              <p className='font-semibold'>{item.name}</p>
              <p className='text-sm'>수량: {item.quantity}개</p>
            </div>
          </div>
          <div className='text-right'>
            <p>{item.price.toLocaleString()}원</p>
            <p className='font-semibold'>
              {(item.price * item.quantity).toLocaleString()}원
            </p>
          </div>
        </div>
      ))}
    </div>
    <div className='text-right text-sm text-gray-500 mt-2'>
      배송비: {shippingFee.toLocaleString()}원
    </div>
    <div className='flex justify-end mt-3 font-bold text-[#E67E22]'>
      총 {order?.items.length}건 {order?.totalAmount.toLocaleString()}원{' '}
      <span className='text-sm text-gray-500 ml-2 font-normal'>
        배송비 포함
      </span>
    </div>
  </div>
</div>
  
      </div>
    );
};

export default OrderDetailPage;