'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
        const userData = localStorage.getItem('user');
        const parsed = userData ? JSON.parse(userData) : null;
        const companyId = parsed?.companyId;

        if (!companyId) {
          console.warn('❗ 회사 정보가 없습니다.', parsed);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/budgets/inquiry`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ companyId }),
          },
        );

        const result = await res.json();
        console.log('🔥 result:', result);

        if (result.data) {
          const raw = result.data;

          const calculated: BudgetSummary = {
            monthlySpending: raw.initialAmount - raw.currentAmount,
            monthlyBudgetLeft: raw.currentAmount,
            yearlySpending: raw.initialAmount - raw.currentAmount,
            lastMonthSpending: raw.lastMonthSpending,
            lastYearSpending: raw.lastYearSpending,
          };

          console.log('📊 calculated summary:', calculated);
          setSummary(calculated);
        } else {
          console.warn('❌ API 응답이 이상함:', result);
        }
      } catch (error) {
        console.error('요약 데이터 불러오기 실패:', error);
      }
    };

    fetchBudgetSummary();
  }, []);

  if (!summary) {
    return null;
  }

  return (
    <motion.div
      className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* 이번 달 지출액 */}
        <Card className='relative z-10 w-full min-w-[280px] h-[210px]'>
          <CardHeader>
            <CardTitle className='text-[24px]'>이번 달 지출액</CardTitle>
            <p className='text-gray-400'>
              지난 달: {summary.lastMonthSpending?.toLocaleString() ?? '0'}원
            </p>
          </CardHeader>
          <CardContent>
            <p className='text-[32px] font-bold'>
              {summary.monthlySpending?.toLocaleString() ?? '0'}원
            </p>
          </CardContent>
        </Card>

        {/* 이번 달 남은 예산 */}
        <Card className='relative z-10 w-full min-w-[280px] h-[210px]'>
          <CardHeader>
            <CardTitle className='text-[24px]'>이번 달 남은 예산</CardTitle>
            <p className='text-gray-400'>
              {typeof summary.lastMonthSpending === 'number'
                ? summary.lastMonthSpending - summary.monthlySpending > 0
                  ? `지난 달보다 ${(summary.lastMonthSpending - summary.monthlySpending).toLocaleString()}원 더 남았어요`
                  : `지난 달보다 ${(summary.monthlySpending - summary.lastMonthSpending).toLocaleString()}원 덜 남았어요`
                : '지난 달이랑 비교 할 데이터가 없어요!'}
            </p>
          </CardHeader>
          <CardContent>
            <p className='text-[32px] font-bold'>
              {summary.monthlyBudgetLeft?.toLocaleString() ?? '0'}원
            </p>
          </CardContent>
        </Card>

        {/* 올해 총 지출액 */}
        <Card className='relative z-10 w-full min-w-[280px] h-[210px]'>
          <CardHeader>
            <CardTitle className='text-[24px]'>올해 총 지출액</CardTitle>
            <p className='text-gray-400'>
              지난 해보다{' '}
              {summary.lastYearSpending
                ? (
                    summary.yearlySpending - summary.lastYearSpending
                  ).toLocaleString()
                : '0'}
              원 더 지출했어요
            </p>
          </CardHeader>
          <CardContent>
            <p className='text-[32px] font-bold'>
              {summary.yearlySpending?.toLocaleString() ?? '0'}원
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SummaryCards;
