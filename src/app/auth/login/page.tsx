'use client';
import React, { useEffect, useState } from 'react';

import { loginApi } from '@/app/api/auth/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = () => {
    const { email, password } = form;

    if (!email || !password) {
      alert('모든 항목을 입력해주세요!');
      return;
    }

    // 이메일 형식 검증 (RFC 6531) - 불필요한 이스케이프 문자 제거
    const emailRegex =
      /^(?<localPart>(?<dotString>[0-9a-z!#$%&'*+-/=?^_`{|}~\u{80}-\u{10FFFF}]+(\.[0-9a-z!#$%&'*+-/=?^_`{|}~\u{80}-\u{10FFFF}]+)*)|(?<quotedString>"([\x20-\x21\x23-\x5B\x5D-\x7E\u{80}-\u{10FFFF}]|\\[\x20-\x7E])*"))(?<!.{64,})@(?<domainOrAddressLiteral>(?<addressLiteral>\[((?<IPv4>\d{1,3}(\.\d{1,3}){3})|(?<IPv6Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){7})|(?<IPv6Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?)|(?<IPv6v4Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){5}:\d{1,3}(\.\d{1,3}){3})|(?<IPv6v4Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3}:)?\d{1,3}(\.\d{1,3}){3})|(?<generalAddressLiteral>[a-z0-9-]*[[a-z0-9]:[\x21-\x5A\x5E-\x7E]+))\])|(?<Domain>(?!.{256,})(([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))(\.([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))*))$/iu;
    if (!emailRegex.test(email)) {
      alert('유효한 이메일 형식이 아닙니다.');
      return;
    }

    loginApi(form)
      .then((res) => {
        console.log('회원가입 데이터', res);
        alert(res.msg);
      })
      .catch((err) => {
        console.error('로그인 오류', err);
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  const isFormValid = Object.values(form).every((value) => value.length > 0);

  return (
    <div className=''>
      <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col '>
        <div className='pr-[10px]'>
          <h2 className='text-[24px] tb:text-[32px] font-semibold text-center'>
            로그인
          </h2>
        </div>
        <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px] '>
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
          <Button
            className='mt-[16px] tb:mt-[40px]'
            filled={isFormValid ? 'orange' : 'gray'}
            onClick={handleClick}
          >
            시작하기
          </Button>
          <div className='flex gap-[4px] mx-auto tb:mt-[8px]'>
            <span className='text-[12px tb:text-[20px] text-[var(--color-gray-600)]'>
              기업 담당자이신가요?
            </span>
            <a className='text-[12px] tb:text-[20px] font-[600] text-[var(--color-primary-400)] underline decoration-1'>
              가입하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
