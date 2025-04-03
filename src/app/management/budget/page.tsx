'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBudgetApi, updateBudgetApi } from '@/app/auth/api';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { showCustomToast } from '@/components/ui/Toast/Toast';

interface AmountField {
  value: string;
  default: string;
  modified: boolean;
}

export default function Budget() {
  const { user, company, isAuth } = useAuthStore();
  const [form, setForm] = useState({
    currentAmount: { value: '0', default: '0', modified: false },
    initialAmount: { value: '0', default: '0', modified: false },
    year: new Date().getFullYear(), // 현재 연도로 기본값 설정
    month: new Date().getMonth() + 1, // 현재 월로 기본값 설정
  });

  const [load, setLoad] = useState(false);
  const router = useRouter();

  // 로딩 상태 설정
  useEffect(() => {
    setLoad(true);
  }, []);

  // 서버에서 예산 정보를 받아와 form 상태 업데이트 (초기 로딩)
  useEffect(() => {
    console.log('company', company);
    console.log('user', user);
    // console.log('dlrj', user.data.campany);
    if (!load) {
      return;
    }

    const fetchBudgetInfo = async () => {
      if (!company || !company.companyId) {
        console.error('회사 ID가 없습니다.');
        return;
      }
      try {
        const response = await getBudgetApi({ companyId: company.companyId });

        console.log('response', response);

        if (response) {
          const { currentAmount, initialAmount, year, month } = response.data;

          if (!year || !month) {
            console.error('올바른 연도와 월이 없습니다.', response);
            return;
          }

          setForm({
            currentAmount: {
              value: Number(currentAmount).toLocaleString('en-US'),
              default: Number(currentAmount).toLocaleString('en-US'),
              modified: false,
            },
            initialAmount: {
              value: Number(initialAmount).toLocaleString('en-US'),
              default: Number(initialAmount).toLocaleString('en-US'),
              modified: false,
            },
            year,
            month,
          });
        }
        console.log('response', response);
      } catch (error) {
        console.error('예산 정보 조회 실패', error);
      }
    };

    fetchBudgetInfo();
  }, [company, load]);

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
    const rawValue = value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) {
      return;
    }
    const formattedValue = rawValue
      ? Number(rawValue).toLocaleString('en-US')
      : '';
    setForm((prev) => ({
      ...prev,
      [name]: {
        ...(prev[name as 'currentAmount' | 'initialAmount'] as AmountField),
        value: formattedValue,
        modified:
          formattedValue !==
          (prev[name as 'currentAmount' | 'initialAmount'] as AmountField)
            .default,
      },
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const field = prev[
        name as 'currentAmount' | 'initialAmount'
      ] as AmountField;
      return {
        ...prev,
        [name]: {
          ...field,
          value: value.trim() === '' ? field.default : value,
          modified: value.trim() !== field.default,
        },
      };
    });
  };

  // Submit: 콤마 제거 후 숫자 데이터 전송, 성공 시 서버 최신 데이터로 업데이트 (수정 상태 false)
  const handleSubmit = async () => {
    if (!form.year || !form.month) {
      console.error('year 또는 month가 올바르게 설정되지 않음', form);
      return;
    }

    try {
      const sendData = {
        companyId: company?.companyId || '',
        currentAmount: Number(form.currentAmount.value.replace(/,/g, '')),
        initialAmount: Number(form.initialAmount.value.replace(/,/g, '')),
        year: form.year,
        month: form.month,
      };

      console.log('전송할 데이터:', sendData);

      await updateBudgetApi(sendData);

      setForm((prev) => ({
        ...prev,
        currentAmount: {
          value: sendData.currentAmount.toLocaleString('en-US'),
          default: sendData.currentAmount.toLocaleString('en-US'),
          modified: false,
        },
        initialAmount: {
          value: sendData.initialAmount.toLocaleString('en-US'),
          default: sendData.initialAmount.toLocaleString('en-US'),
          modified: false,
        },
      }));

      showCustomToast({ label: '예산이 변경되었습니다.' });
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };
  //리턴
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
            name='currentAmount'
            type='text'
            onChange={handleChange}
            // onFocus={handleFocus}
            onBlur={handleBlur}
            value={form.currentAmount.value}
            isModified={form.currentAmount.modified}
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='매달 시작 예산'
            name='initialAmount'
            type='text'
            onChange={handleChange}
            // onFocus={handleFocus}
            onBlur={handleBlur}
            value={form.initialAmount.value}
            isModified={form.initialAmount.modified}
          />
        </div>
        <Button
          className='mt-[16px] tb:mt-[40px]'
          filled='orange'
          onClick={handleSubmit}
        >
          {form.currentAmount.value === '0' && form.initialAmount.value === '0'
            ? '추가하기'
            : '수정하기'}
        </Button>
      </div>
    </div>
  );
}
