export interface Order {
  id: string;
  date: string;
  product: string;
  price: string;
  requester: string;
  handler: string;
  requestDate: string;
}

// ✅ 1. 구매 내역 조회 API (유저의 주문 목록 조회)
export const getOrders = async (userId: string, page = 1, pageSize = 10, sort = "latest") => {
  try {
    const res = await fetch(
      `/api/orders?userId=${userId}&page=${page}&pageSize=${pageSize}&sort=${sort}`
    );

    if (!res.ok) {
      throw new Error(`구매 내역을 불러오지 못했습니다. (status: ${res.status})`);
    }

    const data = await res.json();
    return data.orders as Order[];
  } catch (error) {
    console.error("API 요청 실패:", error);
    return [];
  }
};

//  2. 주문 상세 조회 API
export const getOrderDetail = async (userId: string, orderId: string) => {
  try {
    const res = await fetch(`/api/orders/${orderId}?userId=${userId}`);

    if (!res.ok) {
      throw new Error(`주문 상세 정보를 불러오지 못했습니다. (status: ${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    return null;
  }
};

