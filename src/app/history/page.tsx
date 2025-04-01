"use client";

import { useState } from "react";

import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';
import { Order } from "@/lib/api/orders"; // ✅ Order 타입만 import

import HistoryTable from './components/HistoryTable';
import SummaryCards from './components/SummaryCards';

const mockOrders: Order[] = [ // ✅ Mock 데이터 추가
  {
    id: '1',
    date: '2025-03-20',
    product: '노트북',
    price: '1,500,000',
    requester: '홍길동',
    handler: '김철수',
    requestDate: '2025-03-18',
  },
  {
    id: '2',
    date: '2025-03-19',
    product: '모니터',
    price: '300,000',
    requester: '이영희',
    handler: '박영수',
    requestDate: '2025-03-17',
  },
];

const OrdersPage = () => {
  const [orders] = useState<Order[]>(mockOrders); // ✅ mockOrders를 그대로 사용
  const [isError] = useState(false); // ✅ 에러 상태는 더 이상 필요하지 않음

  return (
    <div className={'w-full px-8 lg:px-16 pt-10 pb-10 bg-[#FBF8F4] min-h-screen'}>
      <div className={'w-full h-[114px] flex justify-between items-center'}>
        <h1 className={'text-[42px] font-bold'}>구매 내역 확인</h1>
      </div>
      <div className={'space-y-6'}>
        <SummaryCards />
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='w-[136px] h-[50px] btn text-gray-500 text-left pl-[14px] border-2 bg-gray-50 rounded-sm'>
                최신순
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={'text-gray-500'}>
              <DropdownMenuItem>최신순</DropdownMenuItem>
              <DropdownMenuItem>높은금액순</DropdownMenuItem>
              <DropdownMenuItem>낮은금액순</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <HistoryTable orders={orders} />
      </div>
    </div>
  );
};

export default OrdersPage;
