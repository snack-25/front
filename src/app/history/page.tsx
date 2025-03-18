"use client";

import { useState, useEffect } from "react";
import { getOrders, Order } from "@/lib/api/orders"; // ✅ API 함수 import
import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';

import HistoryTable from './components/HistoryTable';
import SummaryCards from './components/SummaryCards';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const userId = "현재 로그인된 유저 ID"; // ✅ 실제 로그인된 사용자 ID 가져와야 함

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders(userId); // ✅ API 함수 호출
      setOrders(data); // ✅ 가져온 데이터 상태 업데이트
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className={'w-full px-8 lg:px-16 pt-10 pb-10'}>
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
