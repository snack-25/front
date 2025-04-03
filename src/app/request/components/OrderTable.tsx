'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import PurchaseApprovalModal from '@/components/ui/modal/purchaseApprovalModal';

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
  requester: string;
  price: number;
  items: OrderItem[];
  budgetLeft: number;
}

interface OrderTableProps {
  orders?: Order[];
  onApprove?: (id: string, message: string) => void;
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

  const handleOpenModal = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();

      const transformed: Order = {
        id: data.id,
        date: data.requestedAt?.slice(0, 10) ?? '-',
        requester: data.requesterName,
        price: data.totalAmount ?? 0,
        budgetLeft: data.budgetLeft ?? 0,
        items: (data.items || []).map((i: any) => ({
          id: i.product?.id ?? i.id ?? `${Math.random()}`,
          name: i.product?.name || '상품 없음',
          imageUrl: i.product?.imageUrl || '/images/default.png',
          category: i.product?.categoryName || '기타',
          price: i.price ?? i.product?.price ?? 0,
          quantity: i.quantity ?? 1,
        })),
      };

      setSelectedOrder(transformed);
      setIsOpen(true);
    } catch (err) {
      console.error('상세 데이터 불러오기 실패', err);
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
              onClick={() => router.push(`/request/${order.id}`)}
            >
              <span className='flex-1 text-center'>{order.date}</span>
              <span className='flex-1 text-center'>
                {order.items[0]?.name || '상품 없음'}
              </span>
              <span className='flex-1 text-center'>
                {(order.price ?? 0).toLocaleString()}원
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
                  onClick={() => handleOpenModal(order.id)}
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
          onConfirmAction={(message) => {
            onApprove?.(selectedOrder.id, message);
            setIsOpen(false);
          }}
          requester={selectedOrder.requester}
          items={selectedOrder.items}
          totalAmount={selectedOrder.price ?? 0}
          budgetLeft={selectedOrder.budgetLeft ?? 0}
        />
      )}
    </div>
  );
};

export default OrderTable;
