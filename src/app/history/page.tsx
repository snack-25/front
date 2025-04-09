'use client';

import { useEffect, useState } from 'react';

import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';
import Pagenation from '@/components/ui/Pagination';
import { Order } from '@/lib/api/orders';

import HistoryTable from './components/HistoryTable';
import SummaryCards from './components/SummaryCards';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      try {
        const sortQuery =
          sortOption === '높은금액순'
            ? 'highPrice'
            : sortOption === '낮은금액순'
              ? 'lowPrice'
              : 'latest';

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order-requests?page=${currentPage}&pageSize=10&status=APPROVED&sort=${sortQuery}`,
          {
            credentials: 'include',
          },
        );

        if (!res.ok) {
          throw new Error('주문 불러오기 실패');
        }

        const data = await res.json();
        console.log('✅ 서버 응답 확인', data);

        const approvedOnly = data.filter(
          (item: any) => item.status === 'APPROVED',
        );

        const transformed: Order[] = approvedOnly.map((item: any) => ({
          id: item.id,
          date: item.resolvedAt?.slice(0, 10) ?? '-',
          requestDate: item.requestedAt?.slice(0, 10) ?? '-',
          requester: item.requesterName || '-',
          handler: item.resolverName || '-',
          price: item.totalAmount?.toLocaleString() || '0',
          status: item.status,
          items:
            item.orderRequestItems?.map((it: any) => ({
              name: it.product?.name || '상품 없음',
              quantity: it.quantity || 0,
            })) || [],
        }));

        setOrders(transformed);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        setIsError(true);
      }
    };

    fetchApprovedOrders();
  }, [sortOption]);

  return (
    <div
      className={'w-full px-8 lg:px-16 pt-10 pb-10 bg-[#FBF8F4] min-h-screen'}
    >
      <div className={'w-full h-[114px] flex justify-between items-center'}>
        <h1 className={'text-[42px] font-bold'}>구매 내역 확인</h1>
      </div>
      <div className={'space-y-6'}>
        <SummaryCards />
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='w-[136px] h-[50px] btn text-gray-500 text-left pl-[14px] border-2 bg-gray-50 rounded-sm'>
                {sortOption}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={'text-gray-500'}>
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
        <HistoryTable orders={orders} />

        <Pagenation
          currentPage={currentPage}
          totalPage={totalPage}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
