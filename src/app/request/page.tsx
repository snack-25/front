'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';

import OrderTable from './components/OrderTable'; // ✅ 테이블 컴포넌트 변경

interface Order {
  id: string;
  date: string;
  product: string;
  price: string;
  requester: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    date: '2025-03-20',
    product: '코카콜라 제로 외 1건',
    price: '21,000',
    requester: '김스낵',
  },
  {
    id: '2',
    date: '2025-03-19',
    product: '코카콜라 제로 외 1건',
    price: '63,000',
    requester: '김스낵',
  },
];

const PurchaseRequestPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [sortOption, setSortOption] = useState('최신순');

  const handleApprove = (id: string) => {
    console.log('승인 요청', id);
    // ✅ 여기서 API 호출 + 상태 업데이트 로직 추가 가능
  };

  const handleReject = (id: string) => {
    console.log('반려 요청', id);
    // ✅ 여기서 API 호출 + 상태 업데이트 로직 추가 가능
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
