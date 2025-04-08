import Image from 'next/image';
import LogoImg from '@public/img/landing/landing-title-md.svg';
import { LANDING_CATCHPHRASE } from '@/lib/constants';
import CustomTooltip from '@components/tooltip/CustomTooltip';
import { Button } from '@ui/Button';

export default function Home() {
  return (
    <section
      className='
    grid
    bg-background
    tb:scroll-pt-16
    tb:pt-16
    tb:min-h-[calc(100vh-88px)]
    h-[calc(100vh-54px)]
    pt-11
    scroll-pt-11
    '
    >
      <div
        className='
          container
          w-full
          flex
          flex-col
          max-w-[1920px]
          min-w-[375px]
          mx-auto
          items-center
      '
      >
        <div className='grid place-items-center'>
          <div
            className='
          grid
          gap-y-6
          lt:gap-y-12
          tb:px-28
          mb:px-0
          place-items-center
          '
          >
            <Image
              className='w-2/3 min-w-[181px] max-w-[504px]'
              src={LogoImg}
              alt='logo'
            />
            <p className='self-start rounded-full tb:py-4 tb:px-8 px-3 py-2 bg-gray-50 tb:text-[26px] text-md font-bold text-center keep-all text-primary-400 border-4 border-primary-300 whitespace-nowrap hidden md:block'>
              흩어진 간식 구매처를 통합하고, 기수별 지출을 똑똑하게 관리하세요
            </p>
          </div>
        </div>

        <div className='tb:hidden grid gird-cols-1 gap-2 w-full justify-center pt-8 pb-10'>
          <Button
            variant='outline'
            outlined='orange'
            className='rounded-full bg-white w-[194px] h-10'
          >
            로그인
          </Button>
          <Button
            variant='outline'
            outlined='orange'
            className='rounded-full bg-white w-[194px] h-10'
          >
            관리자 회원가입
          </Button>
        </div>

        <div
          className='
        flex-1
        w-full
        bg-[url(/img/landing/landing-hero-sm.svg)]
        tb:bg-[url(/img/landing/landing-hero-md.svg)]
        tb:bg-contain
        bg-bottom
        bg-no-repeat
        bg-size-[150%]
        '
        >
          <div
            className='
          grid
          tb:grid-cols-2
          tb:grid-rows-2
          tb:gap-[60px]
          gap-1
          pb-14
          '
          >
            {LANDING_CATCHPHRASE.map((phrase) => (
              <div
                key={phrase}
                className='
                  nth-[3]:justify-self-start
                  last:justify-self-end
                  {/*nth-[1]:bg-blue-500*/}
                  nth-[1]:mr-auto

                  {/*nth-[2]:bg-red-500*/}
                  nth-[2]:row-start-3
                  nth-[2]:ml-auto

                  {/*nth-[3]:bg-yellow-500*/}
                  nth-[3]:row-start-1
                  nth-[3]:mx-auto

                  {/*nth-[4]:bg-green-500*/}
                  nth-[4]:row-start-2
                  nth-[4]:mr-auto
                '
              >
                <CustomTooltip content={phrase} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
