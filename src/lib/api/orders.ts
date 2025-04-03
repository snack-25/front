export interface Order {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
  }[];
  price: string;
  requester: string;
  handler: string;
  requestDate: string;
}


// ✅ 1. 주문 목록 조회 API (엔드포인트 수정)
export const getOrders = async (
  userId: string,
  page = 1,
  pageSize = 10,
  sort = 'latest',
) => {
  try {
    const apiUrl = `/orders?userId=${userId}&page=${page}&pageSize=${pageSize}&sort=${sort}`;
    console.log('🔍 API 요청 URL:', apiUrl);

    const res = await fetch(apiUrl);
    console.log('🔍 응답 상태 코드:', res.status);

    if (!res.ok) {
      throw new Error(
        `구매 내역을 불러오지 못했습니다. (status: ${res.status})`,
      );
    }

    const data = await res.json();
    console.log('✅ API 응답 데이터:', data);
    return data.orders;
  } catch (error) {
    console.error('❌ API 요청 실패:', error);
    return [];
  }
};

// ✅ 2. 주문 상세 조회 API (엔드포인트 수정)
export const getOrderDetail = async (userId: string, orderId: string) => {
  try {
    const res = await fetch(`/orders/${orderId}?userId=${userId}`);

    if (!res.ok) {
      throw new Error(
        `주문 상세 정보를 불러오지 못했습니다. (status: ${res.status})`,
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('❌ API 요청 실패:', error);
    return null;
  }
};

// ✅ 3. 주문 생성 API (엔드포인트 수정)
export const createOrder = async (userId: string, orderData: any) => {
  try {
    const res = await fetch(`/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...orderData }),
    });

    if (!res.ok) {
      throw new Error(`주문을 생성하지 못했습니다. (status: ${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('❌ API 요청 실패:', error);
    return null;
  }
};
