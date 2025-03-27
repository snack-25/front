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
}

interface OrderTableProps {
  orders?: Order[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const mockOrders: Order[] = [
  {
    id: '1',
    date: '2025-03-20',
    product: '코카콜라 제로 외 1건',
    price: '21,000',
    requester: '김스낵',
  },
  {
    id: '2',
    date: '2025-03-19',
    product: '코카콜라 제로 외 1건',
    price: '63,000',
    requester: '김스낵',
  },
];

const OrderTable: React.FC<OrderTableProps> = ({
  orders = mockOrders,
  onApprove,
  onReject,
}) => {
  const router = useRouter();

  return (
    <div className='w-full'>
      {orders.length > 0 ? (
        <Table className='w-full border-sperate border-spacing-0 overflow-hidden'>
          <TableHeader className='bg-gray-50 border border-gray-200'>
            <TableRow>
              <TableHead className='rounded-tl-lg'>구매요청일</TableHead>
              <TableHead>상품정보</TableHead>
              <TableHead>주문 금액</TableHead>
              <TableHead>요청인</TableHead>
              <TableHead className='rounded-tr-lg'>비고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className='hover:bg-gray-50 cursor-pointer'
                onClick={() => router.push(`/request/${order.id}`)}
              >
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.price}원</TableCell>
                <TableCell>{order.requester}</TableCell>
                <TableCell
                  onClick={(e) => e.stopPropagation()} // 상세 이동 막기
                >
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onReject?.(order.id)}
                      className='bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300'
                    >
                      반려
                    </button>
                    <button
                      onClick={() => onApprove?.(order.id)}
                      className='bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600'
                    >
                      승인
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className='flex flex-col items-center justify-center py-10'>
          <Image
            src='/img/order/order-nothing-admin-md.svg'
            alt='구매 요청 없음'
            width={300}
            height={200}
          />
          <p className='text-gray-500 mt-4'>신청된 요청이 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
