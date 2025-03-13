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
  const [confrim, setConfirm] = useState(false);

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

    loginApi(form).then((res) => {
      console.log('회원가입 데이터', res);
      alert(res.msg);
    });
  };

  useEffect(() => {
    const test = Object.values(form).filter((x) => {
      return x.length === 0;
    });
    console.log(test);
    const confirm =
      Object.values(form) // 자바스크립트 기본 문법 객체를 배열로 만드는거 Object.keys Object.values Object.entries
        .filter((v) => v.length === 0).length === 0; // 자바스크립트 내장 함수 배열에서 원하는 값을 가져오는 거야
    setConfirm(confirm);
  }, [form]);

  return (
    <div className='pt-[80px] pb-[80px]'>
      <div className='w-[640px] m-auto flex flex-col gap-[56px]'>
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
          filled={confrim ? 'orange' : 'gray'}
          onClick={handleClick}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
