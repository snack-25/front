import Image from 'next/image';

import HeroImg from '@public/img/landing/landing-hero-md.svg';
import LogoImg from '@public/img/landing/landing-title-md.svg';
import CustomTooltip from '@/components/tooltip/CustomTooltip';
import { LANDING_CATCHPHRASE } from '@/lib/constants';

export default function Home() {
  return (
    <section className='grid bg-background scroll-pt-16 pt-16 min-h-[calc(100dvh-88px)]'>
      <div className='container w-full flex flex-col max-w-[1920px] px-16 mx-auto'>
        <div className='grid place-items-center'>
          <div className='grid gap-y-12 place-items-center'>
            <Image
              className='min-w-[184px]'
              width={504}
              height={128}
              src={LogoImg}
              alt='logo'
            />
            <p className='self-start rounded-full py-4 px-8 bg-gray-50 text-[26px] font-bold text-center keep-all text-primary-400 border-4 border-primary-300 whitespace-nowrap hidden md:block'>
              흩어진 간식 구매처를 통합하고, 기수별 지출을 똑똑하게 관리하세요
            </p>
          </div>
        </div>

        <div className='flex-1 bg-[url(/img/landing/landing-hero-md.svg)] bg-no-repeat bg-bottom bg-size-[90%]'>
          <div className='grid grid-cols-2 w-full grid-rows-2 gap-[60px] pt-14'>
            {LANDING_CATCHPHRASE.map((phrase) => (
              <div
                key={phrase}
                className='nth-[3]:justify-self-start last:justify-self-end'
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
