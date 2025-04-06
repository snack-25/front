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
}

const headers = ['구매요청일', '상품정보', '주문 금액', '상태', '비고'];

const MyRequestTable = ( ) => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-requests?userOnly=true`, {
          credentials: 'include',
        });

        const data = await res.json();
        console.log('✅ 내 주문 목록:', data);

        // API 응답 구조에 따라 변환
        const transformed: Order[] = data.map((order: any) => ({
          id: order.id,
          date: order.requestedAt?.slice(0, 10) || '-',
          price: order.totalAmount ?? 0,
          status: order.status ?? 'PENDING',
          items: (order.orderRequestItems || []).map((item: any) => ({
            id: item.product?.id ?? '',
            name: item.product?.name ?? '상품 없음',
            imageUrl: item.product?.imageUrl ?? '/images/default.png',
            category: item.product?.category?.name ?? '기타',
            price: item.price ?? 0,
            quantity: item.quantity ?? 0,
          })),
        }));

        setOrders(transformed);
      } catch (err) {
        console.error('❌ 주문 목록 불러오기 실패:', err);
      }
    };

    fetchMyOrders();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-requests?userOnly=true`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('삭제 실패');

      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      console.error('❌ 요청 취소 실패:', err);
    }
  };

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
              <span className='flex-1 text-center'>{order.date}</span>
              <span className='flex-1 text-center'>
                {order.items[0]?.name ?? '상품 없음'} 외 {order.items.length - 1}건
              </span>
              <span className='flex-1 text-center'>{order.price.toLocaleString()}원</span>
              <span className='flex-1 text-center'>{order.status}</span>
              <div
                className='flex-1 flex justify-center'
                onClick={(e) => e.stopPropagation()}
              >
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className='bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 w-[94px] h-[44px]'
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
