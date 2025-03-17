import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';
import { cn } from '@/lib/utils';
import { EllipsisVertical } from 'lucide-react';

interface IProductMenu {
  className?: string;
}

export default function ProductMenu({ className }: IProductMenu) {
  return (
    <>
      <div className={cn(className)}>
        <DropdownMenu>
          <DropdownMenuTrigger className='focus:outline-none'>
            <EllipsisVertical className='cursor-pointer' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex shadow-none flex-col items-center w-[118px]'>
            <DropdownMenuItem className='border-b-1 border-gray-300 w-full justify-center'>상품 수정</DropdownMenuItem>
            <DropdownMenuItem className='w-full justify-center'>상품 삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
