'use client';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/Button';
import { logoutApi } from './api/auth/api';

declare module 'js-cookie' {
  const Cookies: any;
}

export default function Home() {
  const handleLogout = () => {
    logoutApi()
      .then((res) => {
        console.log('res', res);
        console.log('얜 성공');
      })
      .catch((err) => {
        console.error('로그아웃 오류', err);
        alert(err);
      });
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <span>안녕하세요, Snack25 입니다.</span>
      <img
        src='/img/card/item-coke-zero.png'
        alt='코카콜라 제로'
      />
      <Button onClick={handleLogout}>로그아웃</Button>
    </div>
  );
}
