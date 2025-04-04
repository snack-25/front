export async function fetchApi(
  url: string,
  options: RequestInit = {},
): Promise<any> {
  // 환경변수에서 API_URL을 가져오거나, 기본값을 사용
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
    console.log('data', data);
    return data;
  } catch (err) {
    console.error('❌ [API 호출 실패]', fullUrl, err);
    throw err;
  }
}
