'use client';
import React, { useEffect, useState } from 'react';

import { loginApi } from '@/app/api/auth/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const test = Object.values(form).filter((x) => {
      return x.length === 0;
    });
    console.log(test);
    const confirm =
      Object.values(form).filter((v) => v.length === 0).length === 0;
    setConfirm(confirm);
  }, [form]);

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

  return (
    <div className='pt-[80px] pb-[80px]'>
      <form
        className='w-[640px] m-auto flex flex-col gap-[56px]'
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        <Input
          name='email'
          placeholder='이메일을 입력해주세요'
          onChange={handleChange}
        />
        <Input
          name='password'
          placeholder='비밀번호를 입력해주세요'
          onChange={handleChange}
        />
        <Button
          filled={confirm ? 'orange' : 'gray'}
          onClick={handleClick}
        >
          시작하기
        </Button>
      </form>
    </div>
  );
}
