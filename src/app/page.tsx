'use client';
import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';

import { useAuthStore } from './api/auth/useAuthStore';

export default function Home() {
  const { user, company, logout } = useAuthStore();

  useEffect(() => {
    console.log('landing user', user);
    console.log('landing company', company);
  }, [user]);

  const handleLogout = () => {
    logout();
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
