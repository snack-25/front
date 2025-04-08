'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { createOrderRequest } from '@/lib/api/cart';
import {
  CreateOrderRequestItem,
  CreateOrderRequestPayload,
} from '@/types/cart';
import { showCustomToast } from '@/components/ui/Toast/Toast';

export function useOrderRequest() {
  const router = useRouter();
  const { user } = useAuthStore();

  const submitOrderRequest = async (items: CreateOrderRequestItem[]) => {
    if (!user) {
      showCustomToast({
        label: '로그인이 필요합니다.',
        variant: 'error',
      });
      return false;
    }

    const { id, companyId } = user;

    const payload: CreateOrderRequestPayload = {
      items,
      requesterId: String(id),
      companyId: String(companyId),
      status: 'PENDING',
    };

    try {
      const res = await createOrderRequest(payload);
      showCustomToast({
        label: '구매 요청이 완료되었습니다.',
        variant: 'success',
      });
      router.push(`/order-request/${res.id}`);
      return true;
    } catch (error) {
      console.error('구매 요청 실패:', error);
      showCustomToast({
        label: '구매 요청에 실패했습니다.',
        variant: 'error',
      });
      return false;
    }
  };

  return { submitOrderRequest };
}
