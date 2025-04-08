'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  price: number;
  status: string;
  items: OrderItem[];
}

interface Props {
  orders: Order[];
  onCancel: (id: string) => void;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  setCancelTarget: React.Dispatch<React.SetStateAction<Order | null>>;
}

const headers = ['구매요청일', '상품정보', '주문 금액', '상태', '비고'];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { label: '승인 대기', color: 'text-black-100' };
    case 'APPROVED':
      return { label: '승인 완료', color: 'text-gray-300' };
    case 'REJECTED':
      return { label: '구매 반려', color: 'text-gray-300' };
    default:
      return { label: '알 수 없음', color: 'text-gray-300' };
  }
};

const MyRequestTable = ({
  orders,
  onCancel,
  sortOption,
  setSortOption,
  setCancelTarget,
}: Props) => {
  const router = useRouter();

  return (
    <div className='w-full'>
      {orders.length > 0 ? (
        <div className='flex flex-col'>
          {/* 헤더 */}
          <div className='flex justify-between items-center h-20 bg-gray-50 rounded-full border border-gray-200 text-black-100 text-xl font-medium px-6'>
            {headers.map((header) => (
              <span key={header} className='flex-1 text-center'>
                {header}
              </span>
            ))}
          </div>

          {/* 바디 */}
          {orders.map((order) => (
            <div
              key={order.id}
              className='flex justify-between items-center min-h-[80px] border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-6'
              onClick={() => router.push(`/my-request/${order.id}`)}
            >
              <span className='flex-1 text-center text-black-100'>{order.date}</span>
              <span className='flex-1 text-center'>
                {order.items && order.items.length > 0
                  ? `${order.items[0].name}${order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}`
                  : '상품 없음'}
                <br />
                <span className='text-sm text-gray-500'>
                  총 수량:{' '}
                  {order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}개
                </span>
              </span>
              <span className='flex-1 text-center text-black-100'>
                {order.price.toLocaleString()}원
              </span>
              <span className={`flex-1 text-center ${getStatusInfo(order.status).color}`}>
                {getStatusInfo(order.status).label}
              </span>
              <div
                className='flex-1 flex justify-center'
                onClick={(e) => e.stopPropagation()}
              >
                {order.status === 'PENDING' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCancelTarget(order);
                    }}
                    className='bg-none text-orange-400 font-bold border-2 border-orange-400 px-3 py-1 rounded hover:bg-gray-300 w-[94px] h-[44px]'
                  >
                    요청 취소
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-10'>
          <Image
            src='/img/order/order-nothing-admin-md.svg'
            alt='구매 요청 없음'
            width={300}
            height={200}
          />
          <p className='text-gray-500 text-xl mt-4'>구매 요청이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default MyRequestTable;
