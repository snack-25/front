import { API_BASE_URL } from '@/lib/constants';
import { CartResponse, DeleteCartItemsResponse } from '@/types/cart';

export async function getCartItems(cartId: string): Promise<CartResponse> {
  const res = await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('장바구니 데이터를 불러오는 데 실패했습니다.');
  }

  return res.json();
}

export async function deleteCartItems(
  cartId: string,
  itemIds: string[],
): Promise<DeleteCartItemsResponse> {
  if (!itemIds.length) {
    return { success: false, message: '삭제할 항목이 지정되지 않았습니다.' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ itemIds }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `장바구니 삭제에 실패했습니다. (HTTP ${res.status})`,
      );
    }

    return res.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('장바구니 삭제 요청이 시간 초과되었습니다.');
    }

    throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
  }
}

export async function addCartItem(
  cartId: string,
  productId: string,
  quantity: number = 1,
) {
  const res = await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `상품 추가 실패 (HTTP ${res.status})`);
  }

  return res.json();
}
