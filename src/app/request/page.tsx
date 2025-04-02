'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';

import OrderTable from './components/OrderTable'; // ✅ 테이블 컴포넌트

interface Order {
  id: string;
  date: string;
  product: string;
  price: number;
  requester: string;
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
          `${process.env.NEXT_PUBLIC_API_URL}/order-requests?page=1&pageSize=10&sort=${sortQuery}`, {
            credentials: 'include',
        });

        if (!res.ok) {
          const text = await res.text();
          console.error('주문 목록 불러오기 실패:', res.status, text);
          return;
        }

        const data = await res.json();

        const transformed: Order[] = data.data.map((item: any) => ({
          id: item.id,
          date: item.createdAt.slice(0, 10),
          product: item.summary || '코카콜라 제로 외 1건',
          price: item.totalAmount,
          requester: item.requester?.name || '-',
        }));

        setOrders(transformed);
      } catch (error) {
        console.error('네트워크 에러:', error);
      }
    };

    fetchOrders();
  }, [sortOption]);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: '승인합니다.' }),
      });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('승인 실패:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: '사유 부족으로 반려합니다.' }),
      });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('반려 실패:', err);
    }
  };

  return (
    <div className="w-full px-8 lg:px-16 pt-10 pb-10 bg-[#FBF8F4] min-h-screen">
      <div className="w-full h-[114px] flex justify-between items-center">
        <h1 className="text-[42px] font-bold">구매 요청 관리</h1>
      </div>

      <div className="space-y-6">
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-[136px] h-[50px] btn text-gray-500 text-left pl-[14px] border-2 bg-gray-50 rounded-sm">
                {sortOption}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-500">
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

