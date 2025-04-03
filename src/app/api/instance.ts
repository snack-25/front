export async function fetchApi(
  url: string,
  options: RequestInit = {},
): Promise<any> {
  // 환경변수에서 API_URL을 가져오거나, 기본값을 사용
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const fullUrl = `${baseUrl}${url}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ [API 응답 에러]', fullUrl, data);
      throw new Error(data.message || 'API 요청 실패');
    }

    return data;
  } catch (err) {
    console.error('❌ [API 호출 실패]', fullUrl, err);
    throw err;
  }
}
