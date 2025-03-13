'use client';

import { useCallback,useEffect, useState } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

export function useWindowSize() {
  // ResizeObserver API를 사용하여 크기 변화 감지 로직 구현
  // 디바운스 기능 추가하여 너무 많은 상태 업데이트 방지
  // 필요한 경우에만 렌더링되도록 최적화

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  // 디바운스 함수 생성 - any 타입 제거
  const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number,
  ) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // 상태 업데이트 함수
  const updateSize = useCallback(() => {
    if (typeof window === 'undefined') {return;}

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // 디바운스된 업데이트 함수
  const debouncedUpdateSize = useCallback(debounce(updateSize, 200), [
    updateSize,
  ]);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록 함
    if (typeof window === 'undefined') {return;}

    // 초기 사이즈 설정
    updateSize();

    // ResizeObserver 설정
    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdateSize();
    });

    // 전체 문서 관찰
    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateSize, debouncedUpdateSize]);

  return windowSize;
}
