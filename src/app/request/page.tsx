'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';

import OrderTable from './components/OrderTable'; // ✅ 테이블 컴포넌트

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

const PurchaseRequestPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortOption, setSortOption] = useState('최신순');

  useEffect(() => {
    const fetchOrders = async () => {
      const sortQuery =
        sortOption === '높은금액순'
          ? 'highPrice'
          : sortOption === '낮은금액순'
            ? 'lowPrice'
            : 'latest';

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order-requests?page=1&pageSize=10&sort=${sortQuery}`,
          { credentials: 'include' },
        );

        if (!res.ok) {
          const text = await res.text();
          console.error('주문 목록 불러오기 실패:', res.status, text);
          return;
        }

        const fetchedData = await res.json();
        console.log('✅ 서버 응답 결과', fetchedData);

        if (!Array.isArray(fetchedData)) {
          console.error('응답이 배열이 아님:', fetchedData);
          return;
        }

        const transformed: Order[] = fetchedData.map((item: any) => ({
          id: item.id,
          date: item.createdAt ? item.createdAt.slice(0, 10) : '-', // 오류나서 임시로 처리
          requester: item.requester?.name || '-',
          price: item.totalAmount,
          budgetLeft: item.budgetLeft ?? 0,
          items: (item.orderRequestItems || []).map((i: any) => {
            console.log('✅ 주문 아이템 확인:', JSON.stringify(i, null, 2));
            return {
              id: i.product?.id ?? '',
              name: i.product?.name || '상품 없음',
              imageUrl: i.product?.imageUrl || '/images/default.png',
              category: i.product?.categoryName || '기타',
              price: i.price ?? 0,
              quantity: i.quantity ?? 0,
            };
          }),
        }));

        setOrders(transformed);
      } catch (error) {
        console.error('네트워크 에러:', error);
      }
    };

    fetchOrders();
  }, [sortOption]);

  const handleApprove = async (id: string, message: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}/accept`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminNotes: message }),
        },
      );
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('승인 실패:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminNotes: '사유 부족으로 반려합니다.' }),
        },
      );
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('반려 실패:', err);
    }
  };

  return (
    <div className='w-full px-8 lg:px-16 pt-10 pb-10 bg-[#FBF8F4] min-h-screen'>
      <div className='w-full h-[114px] flex justify-between items-center'>
        <h1 className='text-[42px] font-bold'>구매 요청 관리</h1>
      </div>

      <div className='space-y-6'>
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='w-[136px] h-[50px] btn text-gray-500 text-left pl-[14px] border-2 bg-gray-50 rounded-sm'>
                {sortOption}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='text-gray-500'>
              <DropdownMenuItem onClick={() => setSortOption('최신순')}>
                최신순
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('높은금액순')}>
                높은금액순
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('낮은금액순')}>
                낮은금액순
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <OrderTable
          orders={orders}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default PurchaseRequestPage;
