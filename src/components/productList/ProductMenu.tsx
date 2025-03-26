import { EllipsisVertical } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';
import { cn } from '@/lib/utils';

interface IProductMenu {
  className?: string;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function ProductMenu({ className,onEditClick,onDeleteClick }: IProductMenu) {
  return (
    <>
      <div className={cn(className)}>
        <DropdownMenu>
          <DropdownMenuTrigger className='focus:outline-none'>
            <EllipsisVertical className='cursor-pointer' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex shadow-none flex-col items-center w-[118px]'>
            <DropdownMenuItem onClick={onEditClick} className='border-b-1 border-gray-300 w-full justify-center'>
              상품 수정
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteClick} className='w-full justify-center'>
              상품 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
