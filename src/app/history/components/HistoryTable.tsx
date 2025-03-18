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
  orders: Order[]; // ✅ 부모 컴포넌트에서 전달받을 props 타입 정의
}

const HistoryTable: React.FC<HistoryTableProps> = ({ orders }) => {
  const router = useRouter();

  return (
    <div className='w-full'>
      {orders.length > 0 ? (
        <Table className='w-full border-collapse'>
          <TableHeader className='bg-red-300 rounded-full'>
            <TableRow>
              <TableHead className='rounded-l-full'>구매승인일</TableHead>
              <TableHead>상품정보</TableHead>
              <TableHead>주문 금액</TableHead>
              <TableHead>요청인</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead className='rounded-r-full'>구매요청일</TableHead>
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
          <p className='text-gray-500 mt-4 text-lg'>구매 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
