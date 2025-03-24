import Image from "next/image"

export default function EmptyImage() {
  return (
    <div className='absolute flex flex-col items-center justify-center h-auto w-1/2 left-1/2 -translate-x-1/2'>
                  <div className='absolute w-full h-40'>
                    <Image
                      src={'/img/card/WarningImage.svg'}
                      fill
                      alt='데이터 없음 이미지'
                    />
                  </div>
                  <p className='relative top-[120px] text-2xl text-black-100'>
                    상품이 없습니다
                  </p>
                </div>
  )
}