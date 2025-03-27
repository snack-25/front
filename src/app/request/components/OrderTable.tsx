'use client';

import PurchaseApprovalModal from '@/components/ui/modal/purchaseApprovalModal';
import { useState } from 'react';
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
    price: '21000',
    requester: '김스낵',
  },
  {
    id: '2',
    date: '2025-03-19',
    product: '코카콜라 제로 외 1건',
    price: '63000',
    requester: '김스낵',
  },
];

const OrderTable: React.FC<OrderTableProps> = ({
  orders = mockOrders,
  onApprove,
  onReject,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className='w-full'>
      {orders.length > 0 ? (
        <Table className='w-full border-collapse border border-gray-200 rounded-lg'>
          <TableHeader className='bg-gray-50 text-2lg'>
            <TableRow>
              <TableHead className='rounded-tl-lg px-6 py-4'>구매요청일</TableHead>
              <TableHead className='px-10 py-4'>상품정보</TableHead>
              <TableHead className='px-6 py-4'>주문 금액</TableHead>
              <TableHead className='px-6 py-4'>요청인</TableHead>
              <TableHead className='rounded-tr-lg px-6 py-4'>비고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-2lg text-black-100'>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className='hover:bg-gray-50 cursor-pointer border-b border-gray-200'
                onClick={() => router.push(`/request/${order.id}`)}
              >
                <TableCell className='px-6 py-4'>{order.date}</TableCell>
                <TableCell className='px-10 py-4'>{order.product}</TableCell>
                <TableCell className='px-6 py-4'>{parseInt(order.price).toLocaleString()}원</TableCell>
                <TableCell className='px-6 py-4'>{order.requester}</TableCell>
                <TableCell
                  className='px-6 py-4'
                  onClick={(e) => e.stopPropagation()} // 상세 이동 막기
                >
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onReject?.(order.id)}
                      className='bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 w-[94px] h-[44px]'
                    >
                      반려
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOpen(true);
                      }}
                      className='bg-orange-400 text-white px-3 py-1 rounded hover:bg-orange-600 w-[94px] h-[44px]'
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

      {/* 승인 모달 */}
      {selectedOrder && (
        <PurchaseApprovalModal
          isOpen={isOpen}
          onCloseAction={() => setIsOpen(false)}
          onConfirmAction={() => {
            onApprove?.(selectedOrder.id);
            setIsOpen(false);
          }}
          requester={selectedOrder.requester}
          items={[
            {
              id: '1',
              name: '코카콜라 제로',
              imageUrl: '/images/coke-zero.png',
              category: '청량음료',
              price: parseInt(selectedOrder.price),
              quantity: 1,
            },
          ]}
          totalAmount={parseInt(selectedOrder.price)}
        />
      )}
    </div>
  );
};

export default OrderTable;
