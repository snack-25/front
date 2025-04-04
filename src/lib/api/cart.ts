import { API_BASE_URL } from '@/lib/constants';

export async function getCartItems(cartId: string) {
  const res = await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('장바구니 데이터를 불러오는 데 실패했습니다.');
  }

  return res.json();
}

export async function deleteCartItems(cartId: string, itemIds: string[]) {
  const res = await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ itemIds }),
  });

  if (!res.ok) {
    throw new Error('장바구니 삭제에 실패했습니다.');
  }

  return res.json();
}
