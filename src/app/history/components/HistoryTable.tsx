'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  price: string;
  requester: string;
  handler: string;
  requestDate: string;
}

interface HistoryTableProps {
  orders?: Order[];
}

const headers = [
  '구매승인일',
  '상품정보',
  '주문 금액',
  '요청인',
  '담당자',
  '구매요청일',
];

const HistoryTable: React.FC<HistoryTableProps> = ({ orders = [] }) => {
  const router = useRouter();

  return (
    <div className='w-full'>
      {orders.length > 0 ? (
        <div className='flex flex-col'>
          {/* 헤더 */}
          <div className='min-h-[80px] flex justify-around items-center h-20 bg-gray-50 rounded-full border border-gray-200 text-black-100 text-xl font-medium'>
            {headers.map((header) => (
              <span
                key={header}
                className='flex-1 text-center'
              >
                {header}
              </span>
            ))}
          </div>

          {/* 내용 */}
          {orders.map((order) => {
            console.log('📦 주문 하나 확인:', order);
            return (
              <div
                key={order.id}
                className='flex justify-around items-center h-20 border-b border-line-200 cursor-pointer hover:bg-gray-50'
                onClick={() => router.push(`/history/${order.id}`)}
              >
                <span className='flex-1 text-center'>{order.date}</span>
                <span className='flex-1 text-center'>
                  {order.items && order.items.length > 0
                    ? `${order.items[0].name}${order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}`
                    : '상품 없음'}
                  <br />
                  <span className='text-sm text-gray-500'>
                    총 수량:{' '}
                    {order.items
                      ? order.items.reduce(
                          (sum, item) => sum + (item.quantity || 0),
                          0,
                        )
                      : 0}
                    개
                  </span>
                </span>

                <span className='flex-1 text-"enter'>{order.price}원</span>
                <span className='flex-1 text-"enter'>{order.requester}</span>
                <span className='flex-1 text-"enter'>{order.handler}</span>
                <span className='flex-1 text-"enter'>{order.requestDate}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-10'>
          <Image
            src='/img/order/order-nothing-admin-md.svg'
            alt='구매 내역 없음'
            width={300}
            height={200}
          />
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
