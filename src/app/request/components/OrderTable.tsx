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
      // 주문 상세 데이터 가져오기
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}`,
        {
          credentials: 'include',
        },
      );
      const orderData = await orderRes.json();
      console.log('상세 주문 데이터:', orderData);

      // 주문 품목 확인
      if (!orderData.items || orderData.items.length === 0) {
        console.warn('❗ 주문 품목이 없습니다. API 응답 확인 필요:', orderData);
        alert('주문 품목이 없습니다.');
        return;
      }

      // 회사 ID 가져오기
      const userData = localStorage.getItem('user');
      const parsed = userData ? JSON.parse(userData) : null;
      const companyId = parsed?.companyId;

      if (!companyId) {
        console.warn('❗ 회사 정보가 없습니다.', parsed);
        alert('회사 정보를 불러올 수 없습니다.');
        return;
      }

      // 예산 데이터 가져오기
      const budgetRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/budgets/inquiry`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ companyId }),
        },
      );
      const budgetData = await budgetRes.json();
      console.log('예산 데이터:', budgetData);

      // 데이터 변환
      const items = (orderData.items || []).map((i: any) => ({
        id: i.product?.id ?? i.id ?? `${Math.random()}`,
        name: i.product?.name || '상품 없음',
        imageUrl: i.product?.imageUrl || '/images/default.png',
        category: i.product?.categoryName || '기타',
        price: i.price ?? i.product?.price ?? 0,
        quantity: i.quantity ?? 1,
      }));

      const totalAmount = items.reduce(
        (sum: number, item: OrderItem) => sum + item.price * item.quantity,
        0,
      );

      const transformed: Order = {
        id,
        date: orderData.requestedAt?.slice(0, 10) ?? '-',
        requester: orderData.requesterName,
        price: totalAmount, // 총 금액 계산
        budgetLeft: budgetData.data.currentAmount ?? 0,
        items, // 매핑된 품목 데이터
      };

      console.log('변환된 주문 데이터:', transformed);

      setSelectedOrder(transformed);
      setIsOpen(true);
    } catch (err) {
      console.error('데이터 불러오기 실패', err);
      alert('데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

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
            console.log('🧾 selectedOrder:', selectedOrder);
            console.log('승인 요청 ID:', selectedOrder?.id);
            console.log('승인 메시지:', message);
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
