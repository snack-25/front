'use client';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '../ui/Button';

interface IProps {
  className: string;
  onClick: () => void;
}

export default function MoreButton({ className }: IProps) {
  const iconRef = useRef<SVGSVGElement | null>(null);

  return (
    <>
      <div className={className}>
        <Button
          onClick={() => iconRef.current?.classList.toggle('rotate-180')}
          variant='outline'
          className='lt:w-[640px] lt:h-16 max-lt:w-[327px] max-lt:h-[54px] text-primary-400 border border-primary-400 bg-gray-50 flex gap-2 cursor-pointer 
             transition-colors duration-300 hover:bg-primary-100 [&_svg]:w-6 [&_svg]:h-6'
        >
          <span className='lt:text-xl font-semibold max-lt:text-lg'>
            더보기
          </span>
          <ChevronDown
            ref={iconRef}
            className='transform transition-transform duration-300'
          />
        </Button>
      </div>
    </>
  );
}
