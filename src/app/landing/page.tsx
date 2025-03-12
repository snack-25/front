import { NavigationMenu } from '@/components/ui/NavigationMenu';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className='bg-[#FFF5E5] min-h-screen text-[#E56717]'>
      {/* 네비게이션 바 */}
      <NavigationMenu />

      {/* 메인 이미지 섹션 */}
      <section className='text-center py-10'>
        <img
          src='img\landing\landing-hero-md.svg'
          alt='Snack 배너'
          className='mx-auto w-3/4'
        />
        <h1 className='text-5xl font-bold'>Snack</h1>
        <p className='text-lg mt-4'>
          흩어진 간식 구매처를 통합하고, 가스별 지출을 똑똑하게 관리하세요.
        </p>
      </section>

      {/* 버튼 섹션 */}
      <div className='flex justify-center space-x-4 mt-6'>
        <Button
          filled='orange'
          size='xl'
        >
          로그인
        </Button>
        <Button
          filled='light'
          outlined='orange'
          size='xl'
        >
          관리자 회원가입
        </Button>
      </div>

      {/* 말풍선 설명 섹션 */}
      <section className='flex flex-col items-center space-y-4 mt-10'>
        <img
          src='/img\landing\landing-img-text.svg'
          alt='쉽고 빠르게 구매 요청'
          className='w-64'
        />
        <img
          src='/img\landing\landing-img-text.svg'
          alt='다양한 품목을 한눈에 파악'
          className='w-64'
        />
      </section>
    </div>
  );
}
