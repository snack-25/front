import { Loader2 } from 'lucide-react';

import Header from '@/components/gnb/Header';

export default function PlayGround() {
  return (
    <>
      <Header />
      <div className='text-white text-xl bg-black'>
        <Loader2 />
      </div>
    </>
  );
}
