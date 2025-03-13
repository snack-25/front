import React, { useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '@/lib/constants';

interface ResponsiveImageProps {
  imageSrc: string; // 이미지 경로
  smallSize?: string; // 작은 화면 크기 (예: 'w-[100px] h-[100px]')
  largeSize?: string; // 큰 화면 크기 (예: 'md:w-[160px] md:h-[160px]')
  altText?: string;
}

export default function ResponsiveImage({
  imageSrc,
  smallSize = 'w-[100px] h-[100px]', // 기본값: 상품 이미지 크기
  largeSize = 'md:w-[160px] md:h-[160px]',
  altText = '이미지',
}: ResponsiveImageProps) {
  const [currentImage, setCurrentImage] = useState<string>(imageSrc);

  useEffect(() => {
    if (!imageSrc) return;
    const isSmallScreen = window.innerWidth <= MOBILE_BREAKPOINT;
    setCurrentImage(
      isSmallScreen
        ? imageSrc.replace('-md.svg', '-sm.svg')
        : imageSrc.replace('-sm.svg', '-md.svg'),
    );
  }, [imageSrc]); // imageSrc 변경 감지하여 업데이트

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
