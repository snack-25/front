import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/Button';

interface IProps {
  handleClick: () => void;
  className?: string;
}

export default function FloatingButton({ handleClick, className }: IProps) {
  return (
    <>
      <Button
        variant={'outline'}
        onClick={handleClick}
        className={cn(
          className,
          '[&_svg]:w-9 [&_svg]:h-9 [&_svg]:max-lt:w-6 flex items-center text-gray-50 gap-[2px] lt:w-[163px] lt:h-[68px] max-lt:w-[120px] max-lt:h-[54px] bg-illustration-06 rounded-full cursor-pointer hover:bg-white hover:text-illustration-06 transition-colors duration-300',
        )}
      >
        <Plus />

        <span className='lt:text-2xl max-lt:text-lg font-semibold'>
          상품 등록
        </span>
      </Button>
    </>
  );
}
