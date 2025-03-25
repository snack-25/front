'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

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
  orders?: Order[]; // ✅ orders를 선택적으로 받을 수 있도록 수정
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

const HistoryTable: React.FC<HistoryTableProps> = ({ orders = mockOrders }) => { // ✅ 기본값으로 mockOrders 사용
  const router = useRouter();

  return (
    <div className='w-full'>
      {orders.length > 0 ? (
        <Table className='w-full border-sperate border-spacing-0 overflow-hidden'>
          <TableHeader className='bg-gray-50  border border-gray-200'>
            <TableRow>
              <TableHead className='rounded-tl-lg'>구매승인일</TableHead>
              <TableHead>상품정보</TableHead>
              <TableHead>주문 금액</TableHead>
              <TableHead>요청인</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead className='rounded-tr-lg'>구매요청일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="cursor-pointer hover:bg-gray-50" 
                onClick={() => router.push(`/history/${order.id}`)}
              >
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.price}원</TableCell>
                <TableCell>{order.requester}</TableCell>
                <TableCell>{order.handler}</TableCell>
                <TableCell>{order.requestDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
