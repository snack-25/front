'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { useCustomToast } from '@/components/ui/Toast/Toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/api/auth/useAuthStore';
import { getBudgetApi, updateBudgetApi } from '@/app/api/auth/api';

export default function Budget() {
  const { user, company, isAuth } = useAuthStore();
  const [form, setForm] = useState({
    thisMonth: { value: '0', default: '0', modified: false },
    everyMonth: { value: '0', default: '0', modified: false },
  });
  const [load, setLoad] = useState(false);
  const router = useRouter();

  // 로딩 상태 설정
  useEffect(() => {
    setLoad(true);
  }, []);

  // 서버에서 예산 정보를 받아와 form 상태 업데이트 (초기 로딩)
  useEffect(() => {
    if (!load) return;
    const fetchBudgetInfo = async () => {
      if (!company || !company.id) {
        console.error('회사 ID가 없습니다.');
        return;
      }
      try {
        console.log('company', company);
        const response = await getBudgetApi({ companyId: company.id });
        if (response && response.ok) {
          const { year, month } = response.data;
          const newThisMonth = year
            ? Number(year).toLocaleString('en-US')
            : '0';
          const newEveryMonth = month
            ? Number(month).toLocaleString('en-US')
            : '0';
          setForm({
            thisMonth: {
              value: newThisMonth,
              default: newThisMonth,
              modified: false,
            },
            everyMonth: {
              value: newEveryMonth,
              default: newEveryMonth,
              modified: false,
            },
          });
        }
      } catch (error) {
        console.error('예산 정보 조회 실패', error);
      }
    };
    fetchBudgetInfo();
  }, [user, company, load]);

  // 로그인/권한 체크
  useEffect(() => {
    if (load) {
      if (user?.role !== 'SUPERADMIN' || !isAuth) {
        router.replace('/');
      }
    }
  }, [load, user, isAuth, router]);

  // onChange: 입력된 값 업데이트, 천단위 포맷 적용, 수정 여부 계산
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 기존에 입력된 콤마 제거
    let rawValue = value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) return;
    const formattedValue = rawValue
      ? Number(rawValue).toLocaleString('en-US')
      : '';

    setForm((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        value: formattedValue,
        modified: formattedValue !== prev[name as keyof typeof prev].default,
      },
    }));
  };

  // onFocus: 값이 기본값과 동일하면 빈 문자열로 만들어 입력 필드를 비움 (placeholder 효과)
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        value:
          prev[name as keyof typeof prev].value ===
          prev[name as keyof typeof prev].default
            ? ''
            : prev[name as keyof typeof prev].value,
      },
    }));
  };

  // onBlur: 입력 값이 비어 있으면 기본값으로 복원
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        value:
          value.trim() === '' ? prev[name as keyof typeof prev].default : value,
        modified: value.trim() !== prev[name as keyof typeof prev].default,
      },
    }));
  };

  // Submit: 콤마 제거 후 숫자 데이터 전송, 성공 시 서버 최신 데이터로 업데이트 (수정 상태 false)
  const handleSubmit = async () => {
    try {
      const sendData = {
        companyId: company?.id || '', // Submit 시에만 포함
        thisMonth: Number(form.thisMonth.value.replace(/,/g, '')),
        everyMonth: Number(form.everyMonth.value.replace(/,/g, '')),
      };

      await updateBudgetApi(sendData);

      setForm((prev) => ({
        ...prev,
        thisMonth: {
          value: sendData.thisMonth.toLocaleString('en-US'),
          default: sendData.thisMonth.toLocaleString('en-US'),
          modified: false,
        },
        everyMonth: {
          value: sendData.everyMonth.toLocaleString('en-US'),
          default: sendData.everyMonth.toLocaleString('en-US'),
          modified: false,
        },
      }));

      useCustomToast({ label: '예산이 변경되었습니다.' });
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

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
            type='text'
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={form.thisMonth.value}
            isModified={form.thisMonth.modified}
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='매달 시작 예산'
            name='everyMonth'
            type='text'
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={form.everyMonth.value}
            isModified={form.everyMonth.modified}
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
