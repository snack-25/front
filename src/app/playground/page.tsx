'use client';
import { Loader2 } from 'lucide-react';

import Header from '@/components/gnb/Header';
import CloseButton from '@/components/productList/CloseButton';

export default function PlayGround() {
  return (
    <>
      <Header />
      <div className='text-white text-xl bg-black'>
        <Loader2 />
        <CloseButton
          className=''
          onClick={() => {}}
        />
      </div>
    </>
  );
}
