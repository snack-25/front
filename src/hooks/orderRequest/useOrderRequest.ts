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

    const payload: CreateOrderRequestPayload = {
      items,
      requesterId: String(user.id),
      companyId: String(user.companyId),
      status: 'PENDING',
    };

    try {
      await createOrderRequest(payload);
      showCustomToast({
        label: '구매를 요청하였습니다.',
        variant: 'success',
      });
      router.push('/my-request');
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
