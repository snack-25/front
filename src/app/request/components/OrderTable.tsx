'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import PurchaseApprovalModal from '@/components/ui/modal/purchaseApprovalModal';

interface Order {
  id: string;
  date: string;
  product: string;
  price: number;
  requester: string;
}

interface OrderTableProps {
  orders?: Order[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const headers = ['구매요청일', '상품정보', '주문 금액', '요청인', '비고'];

const OrderTable: React.FC<OrderTableProps> = ({
  orders = [],
  onApprove,
  onReject,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalType, setModalType] = useState<'approved' | 'rejected' | null>(
    null,
  );

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
              <span className="flex-1 text-center">{order.date}</span>
              <span className="flex-1 text-center">{order.product}</span>
              <span className="flex-1 text-center">
                {order.price.toLocaleString()}원
              </span>
              <span className='flex-1 text-center'>{order.requester}</span>
              <div
                className='flex-1 flex justify-center gap-2 pb-0.5'
                onClick={(e) => e.stopPropagation()}
              >
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
              price: selectedOrder.price,
              quantity: 1,
            },
          ]}
          totalAmount={selectedOrder.price}
        />
      )}
    </div>
  );
};

export default OrderTable;
