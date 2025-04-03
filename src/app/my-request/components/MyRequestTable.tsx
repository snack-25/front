'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

const mockOrders: Order[] = [
  {
    id: 'order-1',
    date: '2024-07-04',
    price: 21000,
    status: '승인 대기',
    items: [
      {
        id: 'item-1',
        name: '코카콜라 제로',
        imageUrl: '/images/coke.png',
        category: '음료',
        price: 3000,
        quantity: 4,
      },
      {
        id: 'item-2',
        name: '포카칩',
        imageUrl: '/images/chip.png',
        category: '스낵',
        price: 3000,
        quantity: 3,
      },
    ],
  },
  {
    id: 'order-2',
    date: '2024-07-01',
    price: 27000,
    status: '승인 완료',
    items: [
      {
        id: 'item-3',
        name: '비요뜨',
        imageUrl: '/images/yogurt.png',
        category: '유제품',
        price: 1500,
        quantity: 8,
      },
    ],
  },
  {
    id: 'order-3',
    date: '2024-06-27',
    price: 45000,
    status: '구매 반려',
    items: [
      {
        id: 'item-4',
        name: '커누들',
        imageUrl: '/images/noodle.png',
        category: '식품',
        price: 4500,
        quantity: 10,
      },
    ],
  },
];


const MyRequestTable = ({ orders = mockOrders, onCancel }: Props) => {
  const router = useRouter();

  return (
    <div className='w-full'>
      {orders.length > 0 ? (
        <div className='flex flex-col'>
          {/* 헤더 */}
          <div className='flex justify-between items-center h-20 bg-gray-50 rounded-full border border-gray-200 text-black-100 text-xl font-medium px-6'>
            {headers.map((header) => (
              <span
                key={header}
                className='flex-1 text-center'
              >
                {header}
              </span>
            ))}
          </div>

          {/* 바디 */}
          {orders.map((order) => (
            <div
              key={order.id}
              className='flex justify-between items-center min-h-[80px] border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-6'
              onClick={() => router.push(`/request/${order.id}`)}
            >
              <span className='flex-1 text-center'>{order.date}</span>
              <span className='flex-1 text-center'>
                {order.items[0]?.name || '상품 없음'} 외 {order.items.length - 1}건
              </span>
              <span className='flex-1 text-center'>
                {(order.price ?? 0).toLocaleString()}원
              </span>
              <span className='flex-1 text-center'>{order.status}</span>
              <div
                className='flex-1 flex justify-center'
                onClick={(e) => e.stopPropagation()}
              >
                {order.status === '승인 대기' && (
                  <button
                    onClick={() => onCancel(order.id)}
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
          
        </div>
      )}
    </div>
  );
};

export default MyRequestTable;
