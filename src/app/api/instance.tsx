const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:4000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  // 응답 본문이 없을 경우를 처리
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
    throw new Error('응답을 JSON으로 파싱하는데 실패했습니다.');
  }

  if (!response.ok) {
    console.log(data);
    throw new Error(data.message || 'API 요청 실패');
  }

  return data;
}
