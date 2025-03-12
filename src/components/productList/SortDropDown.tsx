'use client';

import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';
import { ChevronDown } from 'lucide-react';

const sortOption: Record<sortBy, string> = {
  newest: '최신순',
  sales: '판매순',
  lowest: '낮은가격순',
  highest: '높은가격순',
};

export type sortBy =
  | 'newest'
  | 'sales'
  | 'lowest'
  | 'highest'; /* 최신순, 판매순, 낮은가격순, 높은가격순 */

interface IProps {
  value: sortBy;
  setValue: (value: sortBy) => void;
}

export function SortDropDown({ value, setValue }: IProps) {
  const handleSort = (value: sortBy) => {
    setValue(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='flex justify-between items-center gap-4'
      >
        <Button
          variant='outline'
          className='group text-gray-500 text-md font-normal select-none'
        >
          {sortOption[value]}
          <ChevronDown className='transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleSort('newest')}>
            {sortOption.newest}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('sales')}>
            {sortOption.sales}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('lowest')}>
            {sortOption.lowest}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('highest')}>
            {sortOption.highest}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
