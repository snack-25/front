const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:4000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers, // 추가된 헤더 포함
    },
    credentials: 'include', // CORS 요청에서 쿠키 포함
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(data);
    throw new Error(data.message || 'API 요청 실패');
  }

  return data;
}
