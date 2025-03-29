'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { useCustomToast } from '@/components/ui/Toast/Toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/api/auth/useAuthStore';
import { budgetApi } from '@/app/api/auth/api';

export default function Budget() {
  const [form, setForm] = useState({ thisMonth: '0', everyMonth: '0' }); // 기본값 '0'으로 설정
  const [load, setLoad] = useState(false);
  const router = useRouter();
  const { user, company, isAuth } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 기존에 입력된 콤마 제거
    let rawValue = e.target.value.replace(/,/g, '');
    // 숫자만 입력되도록 검사 (빈 문자열도 허용)
    if (!/^\d*$/.test(rawValue)) return;

    // 숫자가 있으면 포맷 적용, 없으면 빈 문자열 처리
    const formattedValue = rawValue
      ? Number(rawValue).toLocaleString('en-US')
      : '';
    setForm((prev) => ({ ...prev, [e.target.name]: formattedValue }));
  };

  const handleSubmit = () => {
    useCustomToast({ label: '예산이 변경되었습니다.' });
    // 서버로 전송하는 로직 추가
  };
  useEffect(() => {
    setLoad(true);
  }, []);

  // 예산 정보를 백엔드에서 받아오는 로직
  useEffect(() => {
    if (!load) return;
    console.log('company', company);

    const fetchBudgetInfo = async () => {
      // companyId가 undefined인 경우에는 fetch를 하지 않도록 처리
      if (!company) throw new Error('회사 Id가 없습니다.');
      if (!company.id) {
        console.error('회사 ID가 없습니다');
        return; // companyId가 없으면 API 호출을 하지 않음
      }

      try {
        // companyId가 존재하는 경우에만 API 호출
        const response = await budgetApi({ companyId: company.id });
        if (response && response.ok) {
          // 예산 정보가 있다면 form에 설정
          const { year, month } = response.data;
          setForm({
            thisMonth: year ? year.toString() : '0',
            everyMonth: month ? month.toString() : '0',
          });
        }
      } catch (error) {
        console.error('예산 정보 조회 실패', error);
      }
    };

    fetchBudgetInfo();
  }, [user]); // user?.companyId가 변경될 때마다 호출

  useEffect(() => {
    if (load) {
      if (user?.role !== 'SUPERADMIN' || !isAuth) {
        router.replace('/');
      }
    }
  }, [load]);

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      <div className='pr-[10px]'>
        <h2 className='text-[24px] tb:text-[32px] font-semibold text-center'>
          예산 관리
        </h2>
      </div>
      <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px]'>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='이번 달 예산'
            name='thisMonth'
            type='text' // 숫자 형식인데, 컴마가 있기 때문에 'text'로 설정
            onChange={handleChange}
            value={form.thisMonth}
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='매달 시작 예산'
            name='everyMonth'
            type='text' // 숫자 형식인데, 컴마가 있기 때문에 'text'로 설정
            onChange={handleChange}
            value={form.everyMonth}
          />
        </div>
        <Button
          className='mt-[16px] tb:mt-[40px]'
          filled='orange'
          onClick={handleSubmit}
        >
          수정하기
        </Button>
      </div>
    </div>
  );
}
