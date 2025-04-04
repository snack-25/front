'use client';

import { useEffect, useState } from 'react';
import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';
import MyRequestTable from './components/MyRequestTable';

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
  price: number;
  status: string;
  items: OrderItem[];
}

const MyRequestPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 🔐 USER 권한만 허용 (선택)
  // const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  // const user = userData ? JSON.parse(userData) : null;
  // const role = user?.role;
  // if (role !== 'USER') return <div className="text-red-500">USER만 접근 가능합니다</div>;

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (!Array.isArray(data)) {
          return;
        }

        const transformed: Order[] = data.map((item: any) => ({
          id: item.id,
          date: item.createdAt?.slice(0, 10) || '-',
          price: item.totalAmount,
          status: item.status,
          items: (item.items || []).map((i: any) => ({
            id: i.product?.id ?? '',
            name: i.product?.name ?? '',
            imageUrl: i.product?.imageUrl ?? '/images/default.png',
            category: i.product?.categoryName ?? '',
            price: i.price ?? 0,
            quantity: i.quantity ?? 0,
          })),
        }));

        setOrders(transformed);
      } catch (err) {
        console.error('내 주문 목록 불러오기 실패:', err);
      }
    };

    fetchMyOrders();
  }, []);

  // ✅ 정렬된 목록
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortOption === '낮은금액순') {
      return a.price - b.price;
    }
    if (sortOption === '높은금액순') {
      return b.price - a.price;
    }
    return 0; // 최신순: 서버 반환 순서 그대로
  });

  // ✅ 페이지네이션 적용
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalPages = Math.ceil(sortedOrders.length / pageSize);

  const handleCancel = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-requests/${id}/cancel`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('요청 취소 실패:', err);
    }
  };

  return (
    <div className='w-full px-8 lg:px-16 pt-10 pb-20 bg-[#FBF8F4] min-h-screen'>
      <div className='w-full h-[114px] flex justify-between items-center'>
        <h1 className='text-[42px] font-bold'>구매 요청 내역</h1>
      </div>

      <div className='space-y-6'>
        {/* 정렬 */}
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
              <DropdownMenuItem onClick={() => setSortOption('낮은금액순')}>
                낮은금액순
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('높은금액순')}>
                높은금액순
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 테이블 */}
        <MyRequestTable
          orders={paginatedOrders}
          onCancel={handleCancel}
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-6 gap-2'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded text-sm ${
                  page === currentPage
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestPage;
