'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Cards';

interface BudgetSummary {
  monthlySpending: number;
  monthlyBudgetLeft: number;
  yearlySpending: number;
  lastMonthSpending?: number;
  lastYearSpending?: number;
}

const SummaryCards = () => {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);

  useEffect(() => {
    const fetchBudgetSummary = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budgets/inquiry`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId: 'YOUR_COMPANY_ID', // 이 부분을 동적으로 처리해도 좋음
          }),
        });

        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error('요약 데이터 불러오기 실패:', error);
      }
    };

    fetchBudgetSummary();
  }, []);

  if (!summary) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {/* 이번 달 지출액 */}
      <Card className='w-[402px] h-[210px]'>
        <CardHeader>
          <CardTitle className='text-[24px]'>이번 달 지출액</CardTitle>
          <p className='text-gray-400'>
            지난 달: {summary.lastMonthSpending != null ? summary.lastMonthSpending.toLocaleString() : '0'}원
          </p>
        </CardHeader>
        <CardContent>
          <p className='text-[32px] font-bold'>
            {summary.monthlySpending != null ? summary.monthlySpending.toLocaleString() : '0'}원
          </p>
        </CardContent>
      </Card>
  
      {/* 이번 달 남은 예산 */}
      <Card className='w-[402px] h-[210px]'>
        <CardHeader>
          <CardTitle className='text-[24px]'>이번 달 남은 예산</CardTitle>
          <p className='text-gray-400'>
            {/* 로직은 추후 업데이트 */}
            지난 달보다 50,000원 더 많아요
          </p>
        </CardHeader>
        <CardContent>
          <p className='text-[32px] font-bold'>
            {summary.monthlyBudgetLeft != null ? summary.monthlyBudgetLeft.toLocaleString() : '0'}원
          </p>
        </CardContent>
      </Card>
  
      {/* 올해 총 지출액 */}
      <Card className='w-[402px] h-[210px]'>
        <CardHeader>
          <CardTitle className='text-[24px]'>올해 총 지출액</CardTitle>
          <p className='text-gray-400'>
            지난 해보다{' '}
            {summary.lastYearSpending != null && summary.yearlySpending != null
              ? (summary.yearlySpending - summary.lastYearSpending).toLocaleString()
              : '0'}
            원 더 지출했어요
          </p>
        </CardHeader>
        <CardContent>
          <p className='text-[32px] font-bold'>
            {summary.yearlySpending != null ? summary.yearlySpending.toLocaleString() : '0'}원
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
  

export default SummaryCards;

