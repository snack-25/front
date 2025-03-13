import { useEffect, useState } from 'react';

import { MOBILE_BREAKPOINT } from '@/lib/constants';

interface ResponsiveImageProps {
  imageSrc: string; // 이미지 경로
  smallSize?: string; // 작은 화면 크기 (예: 'w-[100px] h-[100px]')
  largeSize?: string; // 큰 화면 크기 (예: 'md:w-[160px] md:h-[160px]')
  altText?: string; // 이미지 대체 텍스트
}

export default function ResponsiveImage({
  imageSrc,
  smallSize = 'w-[100px] h-[100px]', // 기본값: 상품 이미지 크기
  largeSize = 'md:w-[160px] md:h-[160px]',
  altText = '이미지',
}: ResponsiveImageProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!imageSrc) {
        return;
      }
      const isSmallScreen = window.innerWidth <= MOBILE_BREAKPOINT;
      setCurrentImage(
        isSmallScreen
          ? imageSrc.includes('-md.svg')
            ? imageSrc.replace('-md.svg', '-sm.svg')
            : imageSrc
          : imageSrc.includes('-sm.svg')
            ? imageSrc.replace('-sm.svg', '-md.svg')
            : imageSrc,
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [imageSrc]);

  return (
    currentImage && (
      <img
        src={currentImage}
        alt={altText}
        className={`${smallSize} ${largeSize}`}
      />
    )
  );
}
