import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { createOrderRequest } from '@/lib/api/cart';
import {
  CreateOrderRequestItem,
  CreateOrderRequestPayload,
} from '@/types/cart';

export function useOrderRequest() {
  const router = useRouter();
  const { user } = useAuthStore();

  const submitOrderRequest = async (items: CreateOrderRequestItem[]) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return false;
    }

    const payload: CreateOrderRequestPayload = {
      items,
      requesterId: String(user.id),
      companyId: String(user.companyId),
      status: 'PENDING',
    };

    try {
      await createOrderRequest(payload);
      alert('주문 요청이 제출되었습니다.');
      router.push('/my-request');
      return true;
    } catch (error) {
      console.error('주문 요청 실패:', error);
      alert('주문 요청에 실패했습니다.');
      return false;
    }
  };

  return { submitOrderRequest };
}
