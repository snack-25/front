import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
  TooltipProvider,
  TooltipArrow,
} from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/Button';

interface CustomTooltipProps {
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

const CustomTooltip = ({ content, placement = 'top' }: CustomTooltipProps) => {
  return (
    <div className='grid place-items-center'>
      <div className='bg-primary-400 text-white font-bold text-[26px] rounded-full py-5 px-8 whitespace-nowrap'>
        {content}
      </div>
      <span className='block'>
        <svg
          className='fill-primary-400 block'
          width='32'
          height='26'
          viewBox='0 0 30 10'
          preserveAspectRatio='none'
        >
          <polygon points='0,0 30,0 15,10'></polygon>
        </svg>
      </span>
    </div>
    // <TooltipProvider>
    //   <Tooltip>
    //     <TooltipTrigger asChild>
    //       <Button className='aspect-square bg-amber-200'>{content}</Button>
    //     </TooltipTrigger>
    //     <TooltipContent
    //       forceMount
    //       className='bg-primary-400 text-white px-5 py-8 rounded-full font-bold text-[26px]'
    //     >
    //       {content}
    //       <TooltipArrow
    //         width={32}
    //         height={26}
    //         className='fill-primary-400'
    //       />
    //     </TooltipContent>
    //   </Tooltip>
    // </TooltipProvider>
  );
};

export default CustomTooltip;
