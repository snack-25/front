import Image from 'next/image';

import useProductDelete from '@/hooks/product/useProductDelete';
import { cn } from '@/lib/utils';


interface IProps {
  id: string;
  name: string;
  isOpen: boolean;
  handleOpen: () => void;
}

const buttonStyle =
  'bg-background-500 rounded-2xl w-full h-[64px] max-lt:h-[54px] lt:text-xl max-lt:text-lg font-semibold cursor-pointer transition-all duration-200';

export default function ProductDeleteModal({
  id,
  name,
  isOpen,
  handleOpen,
}: IProps) {
  const { deleteProduct } = useProductDelete();

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center max-tb:items-end'>
          <div className='absolute inset-0 bg-black opacity-50' />
          <div className='relative flex flex-col items-center justify-center bg-background-400 tb:rounded-4xl max-tb:rounded-t-4xl w-[704px] h-[560px] max-lt:w-[375px] max-lt:h-[508px] gap-6'>
            <div className='relative w-[230px] h-[200px] max-lt:w-[180px] max-lt:h-[160px]'>
              <Image
                src={'/img/modal/important-md.svg'}
                fill
                sizes='(max-width:1200px) 180px, 230px'
                alt='상품 삭제 이미지'
                className='object-contain'
              />
            </div>

            <div className='flex flex-col lt:gap-6 max-lt:gap-4 justify-center items-center'>
              <p className='font-bold text-black-400 lt:text-2xl max-lt:text-xl'>
                상품 삭제
              </p>
              <div className='text-gray-400 font-medium lt:text-xl max-lt:text-md flex flex-col items-center'>
                <p>
                  <span className='text-black-100'>{name}</span> 상품을
                  삭제할까요?
                </p>
                <p>상품 삭제 후에는 복구할 수 없어요!</p>
              </div>
            </div>

            <div className='flex items-center max-lt:flex-col justify-between w-full gap-4 px-3'>
              <button
                className={cn(
                  buttonStyle,
                  ' bg-background-500 text-primary-400 hover:brightness-105',
                )}
                onClick={handleOpen}
              >
                더 생각해볼게요
              </button>
              <button
                className={cn(
                  buttonStyle,
                  'bg-primary-400 text-gray-50 hover:brightness-90',
                )}
                onClick={() => {
                  deleteProduct(id);
                }}
              >
                삭제할래요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
