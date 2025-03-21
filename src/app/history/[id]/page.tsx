"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOrderDetail } from "@/lib/api/orders"; // ✅ 나중에 실제 API 연결

interface OrderDetail {
  id: string;
  date: string;
  product: string;
  price: string;
  requester: string;
  handler: string;
  requestDate: string;
}

const OrderDetailPage = () => {
  const { id } = useParams(); // ✅ URL에서 주문 ID 가져오기
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    // 🛑 백엔드 API가 없으니까 더미 데이터 사용!
    const mockOrder = {
      id: id as string,
      date: "2024.07.04",
      product: "코카콜라 제로 외 1건",
      price: "21,000원",
      requester: "김철수",
      handler: "이영희",
      requestDate: "2024.07.03",
    };

    setOrder(mockOrder);
  }, [id]);

  return (
    <div className="w-full px-8 lg:px-16 pt-10 pb-10">
      <h1 className="text-[42px] font-bold">구매 내역 상세</h1>
      {order ? (
        <div className="mt-6 p-6 bg-white shadow-md rounded-md">
          <p className="text-lg"><strong>상품 정보:</strong> {order.product}</p>
          <p className="text-lg"><strong>주문 금액:</strong> {order.price}</p>
          <p className="text-lg"><strong>요청인:</strong> {order.requester}</p>
          <p className="text-lg"><strong>담당자:</strong> {order.handler}</p>
          <p className="text-lg"><strong>승인일:</strong> {order.date}</p>
          <p className="text-lg"><strong>구매 요청일:</strong> {order.requestDate}</p>
        </div>
      ) : (
        <p>주문 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
