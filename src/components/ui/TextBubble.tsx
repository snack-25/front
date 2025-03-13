'use client';

import React from 'react';

import { useWindowSize } from '@/hooks/useWindowSize';

interface TextBubbleProps {
  text: string;
  width?: number | string;
  size?: 'sm' | 'md';
  className?: string;
}

const TextBubble: React.FC<TextBubbleProps> = ({
  text,
  width = 'auto',
  size = 'md',
  className = '',
}) => {
  const windowSize = useWindowSize();

  // 자동으로 브레이크포인트에 따라 크기 결정 (size prop이 우선)
  const bubbleSize =
    size !== 'sm' && windowSize.width && windowSize.width < 768 ? 'sm' : size;

  // 크기별 설정
  const config = {
    sm: {
      height: 38.67,
      viewBox: '0 0 178 38.67',
      cornerRadius: 16,
      fontSize: '0.75rem',
      fontWeight: 'semibold',
      arrowPath: 'M90.6 37.87c-.8 1.07-2.4 1.07-3.2 0l-4.4-5.87h12z',
      textY: '42.5%',
      mainBubbleHeight: 32, // 화살표가 시작되기 전 높이
      baseWidth: 178, // sm 크기의 기본 너비
    },
    md: {
      height: 100.18,
      viewBox: '0 0 401 100.18',
      cornerRadius: 38,
      fontSize: '1.625rem',
      fontWeight: 'bold',
      arrowPath:
        'M202.2 99.23c-.78 1.27-2.62 1.27-3.41 0l-14.3-23.23h32l-14.3 23.23z',
      textY: '40%',
      mainBubbleHeight: 76, // 화살표가 시작되기 전 높이
      baseWidth: 401, // md 크기의 기본 너비
    },
  };

  const current = config[bubbleSize];

  // size에 따라 bubbleWidth 계산
  const bubbleWidth = width === 'auto' ? current.baseWidth : width;

  const aspectRatio = width === 'auto' ? 'auto' : 'initial';

  // SVG 요소의 width/height 비율 계산
  const heightValue =
    typeof width === 'number'
      ? (width / current.baseWidth) * current.height
      : current.height;

  return (
    <svg
      width={bubbleWidth}
      height={width === 'auto' ? 'auto' : heightValue}
      viewBox={current.viewBox}
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      style={{ aspectRatio }}
      preserveAspectRatio='xMidYMid meet'
    >
      <g fill='bg-primary'>
        {/* 메인 버블 영역(말풍선 밑 삼각형 제외) */}
        <path
          d={`
            M${current.cornerRadius},0
            h${current.baseWidth - 2 * current.cornerRadius}
            a${current.cornerRadius},${current.cornerRadius} 0 0 1 ${current.cornerRadius},${current.cornerRadius}
            v${current.mainBubbleHeight - 2 * current.cornerRadius}
            a${current.cornerRadius},${current.cornerRadius} 0 0 1 -${current.cornerRadius},${current.cornerRadius}
            h-${current.baseWidth - 2 * current.cornerRadius}
            a${current.cornerRadius},${current.cornerRadius} 0 0 1 -${current.cornerRadius},-${current.cornerRadius}
            v-${current.mainBubbleHeight - 2 * current.cornerRadius}
            a${current.cornerRadius},${current.cornerRadius} 0 0 1 ${current.cornerRadius},-${current.cornerRadius}
            z
          `}
        />
        {/* 말풍선 삼각형 부분 */}
        <path d={current.arrowPath} />
      </g>
      <text
        x='50%'
        y={current.textY}
        fontFamily='Pretendard, sans-serif'
        fontWeight={current.fontWeight}
        fontSize={current.fontSize}
        textAnchor='middle'
        dominantBaseline='middle'
        fill='--color-background-500'
      >
        {text}
      </text>
    </svg>
  );
};

export default TextBubble;
