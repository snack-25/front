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

    if (!res.ok) {
      console.error('❗️서버 에러 응답 전체:', data);

      const message = Array.isArray(data.message)
        ? data.message[0]
        : data.message ||
          data.error || // NestJS의 기본 오류 구조
          '서버 오류가 발생했습니다';

      const error = new Error(message);
      (error as any).response = {
        data,
        status: res.status,
      };
      throw error;
    }

    // console.log('data', data);
    return data;
  } catch (err) {
    console.error('❌ [API 호출 실패]', fullUrl, err);
    throw err;
  }
}
