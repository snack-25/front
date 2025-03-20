import Header from '@/components/gnb/Header';
import { Loader2 } from 'lucide-react';

export default function PlayGround() {
  return (
    <>
      <Header />
      <div className='text-white text-xl bg-black'>
        <Loader2/>
      </div>
    </>
  );
}
