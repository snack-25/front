'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  date: string;
  product: string;
  price: string;
  requester: string;
  handler: string;
  requestDate: string;
}

interface HistoryTableProps {
  orders?: Order[];
}

const mockOrders: Order[] = [
  {
    id: '1',
    date: '2025-03-20',
    product: '노트북',
    price: '1,500,000',
    requester: '홍길동',
    handler: '김철수',
    requestDate: '2025-03-18',
  },
  {
    id: '2',
    date: '2025-03-19',
    product: '모니터',
    price: '300,000',
    requester: '이영희',
    handler: '박영수',
    requestDate: '2025-03-17',
  },
];

const headers = ['구매승인일', '상품정보', '주문 금액', '요청인', '담당자', '구매요청일'];

const HistoryTable: React.FC<HistoryTableProps> = ({ orders = mockOrders }) => {
  const router = useRouter();

  return (
    <div className="w-full">
      {orders.length > 0 ? (
        <div className="flex flex-col">
          {/* 헤더 */}
          <div className="min-h-[80px] flex justify-around items-center h-20 bg-gray-50 rounded-full border border-gray-200 text-black-100 text-xl font-medium">
            {headers.map((header) => (
              <span key={header} className="flex-1 text-center">
                {header}
              </span>
            ))}
          </div>

          {/* 내용 */}
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-around items-center h-20 border-b border-line-200 cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/history/${order.id}`)}
            >
              <span className="flex-1 text-center">{order.date}</span>
              <span className="flex-1 text-center">{order.product}</span>
              <span className="flex-1 text-center">{order.price}원</span>
              <span className="flex-1 text-center">{order.requester}</span>
              <span className="flex-1 text-center">{order.handler}</span>
              <span className="flex-1 text-center">{order.requestDate}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <Image
            src="/img/order/order-nothing-admin-md.svg"
            alt="구매 내역 없음"
            width={300}
            height={200}
          />
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
