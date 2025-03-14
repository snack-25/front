'use client';

import { useState } from 'react';

import { signupApi } from '@/app/api/auth/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    validatePassword: '',
    company: '',
    bizno: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = () => {
    const { name, email, password, validatePassword, company, bizno } = form;

    if (
      !name ||
      !email ||
      !password ||
      !validatePassword ||
      !company ||
      !bizno
    ) {
      alert('모든 항목을 입력해주세요!');
      return;
    }
    console.log(form);
    if (password !== validatePassword) {
      alert('비밀번호를 다시 확인해주세요');
      return;
    }

    signupApi(form).then((res) => {
      console.log('res', res);
    });
  };

  const isFormValid = Object.values(form).every((value) => value.length > 0);

  return (
    <div className=''>
      <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col '>
        <div className='pr-[10px]'>
          <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
            기업 담당자 회원가입
          </h2>
          <span className='text-[var(--color-gray-600)] text-[14px] tb:text-[20px]'>
            *그룹 내 유저는 기업 담당자의 초대 메일을 통해 가입이 가능합니다.
          </span>
        </div>
        <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px] '>
          <Input
            name='name'
            placeholder='이름을 입력해주세요'
            onChange={handleChange}
          >
            이름(기업 담당자)
          </Input>
          <Input
            name='email'
            placeholder='이메일을 입력해주세요'
            onChange={handleChange}
          >
            이메일
          </Input>
          <Input
            name='password'
            placeholder='비밀번호를 입력해주세요'
            onChange={handleChange}
          >
            비밀번호
          </Input>
          <Input
            name='validatePassword'
            placeholder='비밀번호를 다시 한 번 입력해주세요'
            onChange={handleChange}
          >
            비밀번호 확인
          </Input>
          <Input
            name='company'
            placeholder='회사명을 입력해주세요'
            onChange={handleChange}
          >
            회사명
          </Input>
          <Input
            name='bizno'
            placeholder='사업자 번호를 입력해주세요'
            onChange={handleChange}
          >
            사업자 번호
          </Input>
          <Button
            className='mt-[16px] tb:mt-[40px]'
            filled={isFormValid ? 'orange' : 'gray'}
            onClick={handleClick}
          >
            시작하기
          </Button>
          <div className='flex gap-[4px] mx-auto tb:mt-[8px]'>
            <span className='text-[12px tb:text-[20px] text-[var(--color-gray-600)]'>
              이미 계정이 있으신가요?
            </span>
            <a className='text-[12px] tb:text-[20px] font-[600] text-[var(--color-primary-400)] underline decoration-1'>
              로그인
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
