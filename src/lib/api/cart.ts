import { API_BASE_URL } from '@/lib/constants';
import {
  CartItem,
  CartResponse,
  CreateOrderRequestPayload,
  DeleteCartItemsResponse,
  GetCartSummaryResponse,
} from '@/types/cart';

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
): Promise<CartItem> {
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

export async function updateCartItemQuantity(
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<CartItem> {
  const res = await fetch(`${API_BASE_URL}/carts/${cartId}/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    throw new Error('수량 변경에 실패했습니다.');
  }

  return res.json();
}

export async function createOrder(
  items: { productId: string; quantity: number }[],
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `주문 실패 (HTTP ${res.status})`);
  }

  return res.json();
}

export async function createOrderRequest(data: CreateOrderRequestPayload) {
  const res = await fetch(`${API_BASE_URL}/order-requests`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('주문 요청 생성에 실패했습니다.');
  }

  return res.json();
}

export async function getSelectedCartSummary(
  cartId: string,
  items: { productId: string; quantity: number }[],
): Promise<GetCartSummaryResponse> {
  const res = await fetch(`${API_BASE_URL}/carts/${cartId}/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    throw new Error('선택된 상품 요약 정보 조회 실패');
  }

  return res.json();
}
