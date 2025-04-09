'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Props } from '@/types/cart';

export default function OrderRequestActions({ cartId }: Props) {
  const router = useRouter();

  return (
    <div className='flex gap-4 w-full'>
      <Button
        filled='light'
        width='100%'
        onClick={() => router.push(`/cart/${cartId}`)}
      >
        장바구니로 돌아가기
      </Button>
      <Button
        filled='orange'
        width='100%'
        onClick={() => router.push('/my-request')}
      >
        요청 내역 확인하기
      </Button>
    </div>
  );
}
