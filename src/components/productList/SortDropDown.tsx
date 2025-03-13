'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';

export type sortBy = 'newest' | 'sales' | 'lowest' | 'highest';

const sortOption: Record<sortBy, string> = {
  newest: '최신순',
  sales: '판매순',
  lowest: '낮은가격순',
  highest: '높은가격순',
};

export function SortDropDown() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mainCategory = searchParams.get('mainCategory') || 'snack';
  const subCategory = searchParams.get('subCategory') || 'snack';
  const sort = (searchParams.get('sort') as sortBy) || 'newest';

  const updateSort = (key: sortBy) => {
    const params = new URLSearchParams();
    params.set('mainCategory', mainCategory);
    params.set('subCategory', subCategory);
    params.set('sort', key);
    router.replace(`?${params.toString()}`);
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
          {sortOption[sort]}
          {sortOption[sort]}
          <ChevronDown className='transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.entries(sortOption).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => updateSort(key as sortBy)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
