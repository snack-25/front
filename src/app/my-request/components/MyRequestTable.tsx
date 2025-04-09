'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Order } from '@/types/order';

interface OrderItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
  productId: string;
}


interface Props {
  orders: Order[];
  onCancel: (id: string) => void;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  setCancelTarget: React.Dispatch<React.SetStateAction<Order | null>>;
}

const headers = ['구매요청일', '상품정보', '주문 금액', '상태', '비고'];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { label: '승인 대기', color: 'text-black-100' };
    case 'APPROVED':
      return { label: '승인 완료', color: 'text-gray-300' };
    case 'REJECTED':
      return { label: '구매 반려', color: 'text-gray-300' };
    default:
      return { label: '알 수 없음', color: 'text-gray-300' };
  }
};

const MyRequestTable = ({
  orders,
  onCancel,
  sortOption,
  setSortOption,
  setCancelTarget,
}: Props) => {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Image
          src="/img/order/order-nothing-admin-md.svg"
          alt="구매 요청 없음"
          width={300}
          height={200}
        />
        <p className="text-gray-500 text-xl mt-4">구매 요청이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 💻 데스크탑용 리스트 */}
      <div className="hidden md:flex flex-col">
        <div className="flex justify-between items-center h-20 bg-gray-50 rounded-full border border-gray-200 text-black-100 text-xl font-medium px-6">
          {headers.map((header) => (
            <span key={header} className="flex-1 text-center">
              {header}
            </span>
          ))}
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center min-h-[80px] border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-6"
            onClick={() => router.push(`/my-request/${order.id}`)}
          >
            <span className="flex-1 text-center text-black-100">{order.date}</span>
            <span className="flex-1 text-center">
              {order.items.length > 0
                ? `${order.items[0].name}${order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}`
                : '상품 없음'}
              <br />
              <span className="text-sm text-gray-500">
                총 수량: {order.items.reduce((sum, i) => sum + i.quantity, 0)}개
              </span>
            </span>
            <span className="flex-1 text-center text-black-100">
              {order.price.toLocaleString()}원
            </span>
            <span className={`flex-1 text-center ${getStatusInfo(order.status).color}`}>
              {getStatusInfo(order.status).label}
            </span>
            <div
              className="flex-1 flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {order.status === 'PENDING' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCancelTarget(order);
                  }}
                  className="bg-none text-orange-400 font-bold border-2 border-orange-400 px-3 py-1 rounded hover:bg-gray-300 w-[94px] h-[44px]"
                >
                  요청 취소
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 📱 모바일/타블렛용 리스트 */}
      <div className="flex flex-col md:hidden space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="w-full border-t border-line-200 bg-none py-3 px-4 cursor-pointer"
            onClick={() => router.push(`/my-request/${order.id}`)}
          >
            {/* 상단: 이미지 + 상품명/수량 + 요청취소 */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
                <img
                  src={order.items[0]?.imageUrl || '/images/default-product.png'}
                  alt="상품 이미지"
                  className="w-[50px] h-[50px] object-cover"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-[15px] font-medium">
                    {order.items[0]?.name}
                    {order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    총 수량: {order.items.reduce((sum, i) => sum + i.quantity, 0)}개
                  </p>
                </div>
              </div>

              {/* 요청 취소 버튼 */}
              {order.status === 'PENDING' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCancelTarget(order);
                  }}
                  className="w-[72px] h-[36px] text-sm font-medium border border-orange-400 text-orange-400 rounded hover:bg-gray-100"
                >
                  요청 취소
                </button>
              )}
            </div>

            {/* 하단 정보 */}
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <div className="flex justify-between font-semibold border-b pb-2">
                <p className="text-black-400">주문 금액</p>
                <p className="text-black-400">{order.price.toLocaleString()}원</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-400">구매요청일</p>
                <p>{order.date}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-400">상태</p>
                <p className={`${getStatusInfo(order.status).color}`}>
                  {getStatusInfo(order.status).label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequestTable;
