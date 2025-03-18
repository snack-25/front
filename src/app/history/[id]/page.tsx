"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PurchaseItemList from "../components/PurchaseItemList";
import PurchaseSummary from "../components/PurchaseSummary";
import PurchaseRequestInfo from "../components/PurchaseRequestInfo";
import PurchaseApprovalInfo from "../components/PurchaseApprovalInfo";

const PurchaseDetailPage = () => {
  const { id } = useParams(); // ✅ URL에서 id 가져오기
  const [purchase, setPurchase] = useState<{
    items: any[];
    totalItems: number;
    totalAmount: number;
    requestInfo: any;
    approvalInfo: any;
  } | null>(null);

  useEffect(() => {
    // API에서 구매 내역 데이터 가져오기 (현재는 더미 데이터 사용)
    fetch(`/api/history/${id}`)
      .then((res) => res.json())
      .then((data) => setPurchase(data))
      .catch((err) => console.error("데이터 로드 실패", err));
  }, [id]);

  if (!purchase) return <p>로딩 중...</p>;

  return (
    <div className="w-full px-8 lg:px-16 py-10 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">구매 내역 상세</h1>
      <div className="grid grid-cols-3 gap-8">
        {/* 왼쪽: 구매 품목 리스트 */}
        <div className="col-span-2">
          <PurchaseItemList items={purchase.items} />
          <PurchaseSummary totalItems={purchase.totalItems} totalAmount={purchase.totalAmount} />
        </div>
        
        {/* 오른쪽: 요청 정보 & 승인 정보 */}
        <div className="col-span-1 space-y-6">
          <PurchaseRequestInfo requestInfo={purchase.requestInfo} />
          <PurchaseApprovalInfo approvalInfo={purchase.approvalInfo} />
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailPage;
