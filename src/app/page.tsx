'use client';
import { useEffect } from 'react';
import { useAuthStore } from './api/auth/useAuthStore';
import Image from 'next/image';
import HeroImg from '@public/img/landing/landing-hero-md.svg';
import LogoImg from '@public/img/landing/landing-title-md.svg';
import TextBubble from '@/components/ui/TextBubble';

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
    <section className='grid place-items-center min-h-[calc(100dvh-54px)] bg-background'>
      <div className='container grid place-items-center gap-y-12 max-w-3xl'>
        <Image
          className='min-w-[184px]'
          width={504}
          height={128}
          src={LogoImg}
          alt='logo'
        />
        <p className='rounded-full py-4 px-8 bg-gray-50 text-[26px] font-bold text-center keep-all text-primary-400 border-4 border-primary-300 whitespace-nowrap hidden md:block'>
          흩어진 간식 구매처를 통합하고, 기수별 지출을 똑똑하게 관리하세요
        </p>
      </div>
      <Image
        className='w-full mt-auto max-w-[1674px]'
        src={HeroImg}
        alt='logo'
      />
    </section>
  );
}
