// src/app/history/ClientPage.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import SummaryCards from './SummaryCards';
import HistoryTable from './HistoryTable';
import Pagination from '@/components/ui/Pagination';
import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';
import { Order } from '@/lib/api/orders';

const ClientPage = () => {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [orders, setOrders] = useState<Order[]>([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [totalPage, setTotalPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      const sortQuery =
        sortOption === '최신순'
          ? 'latest'
          : sortOption === '높은금액순'
            ? 'highPrice'
            : sortOption === '낮은금액순'
              ? 'lowPrice'
              : 'latest';

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?page=${currentPage}&pageSize=${pageSize}&sort=${sortQuery}`,
        { credentials: 'include' }
      );
      const data = await res.json();

      const transformed: Order[] = data.orders.map((item: any) => ({
        id: item.id,
        date: item.createdAt?.slice(0, 10) ?? '-',
        requestDate: item.createdAt?.slice(0, 10) ?? '-',
        requester: item.requestedBy?.name || '-',
        handler: item.updatedBy?.name || '-',
        price: item.totalAmount?.toLocaleString() + '원' || '0원',
        status: item.status,
        items: item.orderItems?.map((it: any) => ({
          name: it.product?.name || '상품 없음',
          quantity: it.quantity || 0,
        })) || [],
      }));

      setOrders(transformed);
      setTotalPage(data.totalPages);
    };

    fetchOrders();
  }, [sortOption, currentPage]);

  return (
    <div className='w-full px-8 lg:px-16 pt-10 pb-10 bg-[#FBF8F4] min-h-screen'>
      <div className='w-full h-[114px] flex justify-between items-center'>
        <h1 className='text-[42px] font-bold'>구매 내역 확인</h1>
      </div>

      <div className='space-y-6'>
        <SummaryCards />

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

        <HistoryTable orders={orders} />
        <Pagination currentPage={currentPage} totalPage={totalPage} />
      </div>
    </div>
  );
};

export default ClientPage;
