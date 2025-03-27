'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface OrderItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  date: string;
  items: OrderItem[];
  requester: string;
  handler: string;
  requestDate: string;
}

interface BudgetInfo {
  monthlyLimit: number;
  remaining: number;
}

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [budget, setBudget] = useState<BudgetInfo>({
    monthlyLimit: 1500000,
    remaining: 200000,
  });

  const totalCost = order
    ? order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  const remainingAfterPurchase = budget.remaining - totalCost;
  const isOverBudget = remainingAfterPurchase < 0;

  useEffect(() => {
    // Mock 데이터 설정
    const mockOrder: OrderDetail = {
      id: id as string,
      date: '2024.07.24',
      items: Array(6).fill({
        id: '1',
        category: '청량.음료',
        name: '코카콜라 제로',
        quantity: 4,
        price: 2000,
      }),
      requester: '김스낵',
      handler: '김코드',
      requestDate: '2024.07.20',
    };

    setOrder(mockOrder);
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-[#FBF8F4] flex px-16 pt-10 pb-10">
      {/* 왼쪽 품목 목록 */}
      <div className="w-2/3 pr-8">
        <h1 className="text-3xl font-bold">구매 요청 상세</h1>

        <div className="mt-6 bg-white rounded-md p-6 border-2">
          <h2 className="text-xl font-bold mb-4">요청 품목</h2>

          <div className="border rounded-md max-h-[400px] overflow-y-auto">
            {order?.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border-b last:border-none"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/images/coke-zero.png"
                    alt={item.name}
                    className="w-14 h-14 rounded-md"
                  />
                  <div>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm font-semibold">
                      수량: {item.quantity}개
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p>{item.price.toLocaleString()}원</p>
                  <p className="text-lg font-semibold">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 총 금액 */}
          <div className="flex justify-end mt-6 text-xl font-bold text-[#E67E22]">
            <span className="text-black">총 {order?.items.length}건</span>
            <span className="ml-2">{totalCost.toLocaleString()}원</span>
          </div>
        </div>

        {/* 하단 승인/반려 버튼 */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold">
            요청 반려
          </button>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold">
            요청 승인
          </button>
        </div>
      </div>

      {/* 오른쪽 요청 정보 + 예산 */}
      <div className="w-1/3 px-16 pt-10 pb-10">
        {/* 요청 정보 */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold border-b-2 border-black-100">
            요청 정보
          </h2>
          <p className="text-xl text-gray-400 mt-2">{order?.requestDate}</p>

          <div className="mt-2">
            <label className="block text-xl font-semibold text-black-400">
              요청인
            </label>
            <input
              type="text"
              value={order?.requester}
              readOnly
              className="mt-1 w-full rounded-md border-2 text-lg pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xl font-semibold text-black-400">
              요청 메시지
            </label>
            <textarea
              value="코카콜라 제로 인기가 많아요."
              readOnly
              rows={2}
              className="mt-1 w-full rounded-md border-2 text-lg resize-none pl-[24px] pt-[14px] pb-[18px] pr-[24px] text-gray-500"
            />
          </div>
        </div>

        {/* 예산 정보 */}
        <div className="bg-white shadow-md rounded-md p-6 mt-6">
          <h2 className="text-xl font-bold border-b-2 border-black-100">
            예산 정보
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">
                이번 달 지원예산
              </label>
              <input
                value={budget.monthlyLimit.toLocaleString() + '원'}
                readOnly
                className="mt-1 w-full rounded-md border-2 px-4 py-3 text-gray-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                이번 달 남은 예산
              </label>
              <input
                value={budget.remaining.toLocaleString() + '원'}
                readOnly
                className={`mt-1 w-full rounded-md border-2 px-4 py-3 ${
                  isOverBudget ? 'border-red-500' : 'border-gray-200'
                } text-gray-500`}
              />
              {isOverBudget && (
                <p className="text-red-500 text-sm mt-1">
                  구매 금액이 남은 예산을 초과했습니다.
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                구매 후 예산
              </label>
              <input
                value={remainingAfterPurchase.toLocaleString() + '원'}
                readOnly
                className="mt-1 w-full rounded-md border-2 px-4 py-3 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
