'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { createOrder } from '@/lib/api/cart';
import { CreateOrderItem } from '@/types/cart';
import { showCustomToast } from '@/components/ui/Toast/Toast';

export function useOrder() {
  const router = useRouter();
  const { user } = useAuthStore();

  const submitOrder = async (items: CreateOrderItem[]) => {
    if (!user) {
      showCustomToast({
        label: '로그인이 필요합니다.',
        variant: 'error',
      });
      return false;
    }

    try {
      const res = await createOrder(items);
      showCustomToast({
        label: '주문이 완료되었습니다!',
        variant: 'success',
      });
      router.push(`/order/${res.id}`);
      return true;
    } catch (error) {
      console.error('🛒 주문 실패:', error);
      showCustomToast({
        label: '주문에 실패했습니다.',
        variant: 'error',
      });
      return false;
    }
  };

  return { submitOrder };
}
