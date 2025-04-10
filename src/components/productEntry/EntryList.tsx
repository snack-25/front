import Image from 'next/image';

interface IProps {
  items: any[];
}

const headList: string[] = ['등록일', '상품명', '카테고리', '가격'];

export default function EntryList({ items }: IProps) {
  return (
    <>
      <header className='max-lt:hidden min-w-[1200px] grid grid-cols-4  px-20 max-w-[1680px] h-20 place-items-center text-black-100 text-xl font-medium bg-gray-50 rounded-full border border-gray-200'>
        {headList.map((head) => (
          <span key={head}>{head}</span>
        ))}
      </header>

      <div className='max-lt:hidden flex flex-col max-w-[1680px] px-20 min-w-[1200px]'>
        {items?.map((data) => (
          <div
            key={data.id}
            className=' lt:grid lt:grid-cols-4 h-[104px] place-items-center text-black-100 text-xl border-b border-line-200 bg-background-400'
          >
            <p>{Intl.DateTimeFormat('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(new Date(data.createdAt)) || new Date().toDateString()}</p>
            <div className='grid grid-cols-2 gap-4 place-items-center'>
              <div className='relative w-20 h-20 bg-gray-50 border border-line-200 rounded-lg'>
                <Image
                  src={data.imageUrl || '/img/card/WarningImage.svg'}
                  fill
                  alt='등록 상품 이미지'
                  sizes='80px'
                />
              </div>
              <p>{data.name || '상품명'}</p>
            </div>
            <p>{data.category || '청량/탄산음료'}</p>
            <p>{data.price.toLocaleString() || 1} 원</p>
          </div>
        ))}
      </div>
      <div className='lt:hidden flex border-b-1 border-b-line-200 flex-col'>
        {items?.map((data) => (
          <div
            key={data.id}
            className=' border-1 border-b-line-200 flex flex-col'
          >
            <div className='flex items-center justify-start gap-4 px-6 mb:h-[136px] max-mb:h[120px]'>
              <div className='relative w-20 h-20 bg-gray-50 border border-line-200 rounded-lg'>
                <Image
                  src={data.imageUrl || '/img/card/WarningImage.svg'}
                  fill
                  alt='등록 상품 이미지'
                />
              </div>
              <div className='h-20'>
                <p className='font-normal text-md text-black-400'>
                  {data.name || '상품명'}
                </p>
                <p className='font-normal text-xs text-gray-500'>
                  {data.category || '청량/탄산음료'}
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-2 mx-6 pt-3 pb-8 border-t-1 border-t-line-200 text-gray-500 font-normal text-md'>
              <p className='flex justify-between'>
                <span>등록일</span>
                <span>
                  {Intl.DateTimeFormat('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }).format(new Date(data.createdAt)) ||
                    new Date().toLocaleDateString()}
                </span>
              </p>
              <p className='flex justify-between'>
                <span>가격</span>
                <span>{data.price?.toLocaleString() || 1} 원</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
