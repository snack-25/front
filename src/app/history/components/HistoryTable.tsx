"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Image from "next/image";

interface Order {
  id: number;
  date: string;
  product: string;
  price: string;
  requester: string;
  handler: string;
  requestDate: string;
}

const mockOrders: Order[] = []; // ❌ 데이터가 없을 경우

const HistoryTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(mockOrders); // 현재는 더미 데이터로 설정
  }, []);

  return (
    <div className="w-full">
      {orders.length > 0 ? (
        <Table className="w-full border-collapse">
          <TableHeader className="bg-red-300 rounded-full">
            <TableRow>
              <TableHead className="rounded-l-full">구매승인일</TableHead>
              <TableHead>상품정보</TableHead>
              <TableHead>주문 금액</TableHead>
              <TableHead>요청인</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead className="rounded-r-full">구매요청일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.price}원</TableCell>
                <TableCell>{order.requester}</TableCell>
                <TableCell>{order.handler}</TableCell>
                <TableCell>{order.requestDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <Image
            src="/img/order/order-nothing-admin-md.svg"
            alt="구매 내역 없음"
            width={300}
            height={200}
          />
          <p className="text-gray-500 mt-4 text-lg">구매 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;