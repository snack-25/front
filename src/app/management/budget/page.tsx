'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { useCustomToast } from '@/components/ui/Toast/Toast';

export default function Budget() {
  const [form, setForm] = useState({ thisMonth: '', everyMonth: '' });
  const [placeholderValue, setPlaceholderValue] = useState({
    thisMonth: '3,500,000',
    everyMonth: '3,000,000',
  });
  const [modal, setModal] = useState(false);

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
    const valueToSend = {
      thisMonth:
        form.thisMonth.trim() === ''
          ? placeholderValue.thisMonth
          : form.thisMonth,
      everyMonth:
        form.everyMonth.trim() === ''
          ? placeholderValue.everyMonth
          : form.everyMonth,
    };
    console.log('전송할 값:', valueToSend);

    useCustomToast({ label: '예산이 변경되었습니다.' });

    // 이후 valueToSend 객체를 서버로 전송하는 로직 추가
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
            placeholder={placeholderValue.thisMonth}
            onChange={handleChange}
            value={form.thisMonth}
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='매달 시작 예산'
            name='everyMonth'
            placeholder={placeholderValue.everyMonth}
            onChange={handleChange}
            value={form.everyMonth}
          />
        </div>
        <Button
          className='mt-[16px] tb:mt-[40px]'
          filled='orange'
          onClick={handleSubmit}
          //   disabled={!isFormValid}
        >
          수정하기
        </Button>
      </div>
    </div>
  );
}
