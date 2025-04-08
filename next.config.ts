import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snack25-bucket.s3.ap-northeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    dangerouslyAllowSVG: true, // SVG 허용
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // 보안 강화
  },
};

export default nextConfig;
/**
 * 아래 코드는 bundle analyzer를 사용할 때만 실행되도록 설정하는 코드입니다.
 * 이 코드를 사용하려면 @next/bundle-analyzer 패키지를 설치해야 합니다.
 * analyzer을 사용하려면 아래 내용을 import 하고 하단의 주석을 해제하고 사용하면 됩니다.
 * import withBundleAnalyzer from '@next/bundle-analyzer';
 * */
// export default withBundleAnalyzer({
//   // analyze일 때만 bundle analyzer를 실행하도록 설정
//   enabled: process.env.ANALYZE === 'true',
//   // openAnalyzer: true, // by default: true
// })(nextConfig);
