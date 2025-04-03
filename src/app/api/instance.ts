export async function fetchApi(
  url: string,
  options: RequestInit = {},
): Promise<any> {
  const baseUrl = 'http://localhost:4000/api';
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
