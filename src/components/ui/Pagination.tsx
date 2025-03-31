import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

function getPaginationRange(
  current: number,
  total: number,
  maxNumbers: number = 4,
): (number | 'dots')[] {
  const range: (number | 'dots')[] = [];

  if (total <= maxNumbers + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(2, current - Math.floor(maxNumbers / 2));
  const right = Math.min(total - 1, left + maxNumbers - 1);

  range.push(1); // 항상 첫 페이지

  if (left > 2) {
    range.push('dots');
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push('dots');
  }

  range.push(total); // 항상 마지막 페이지

  return range;
}

interface IProps {
  currentPage: number;
  totalPage: number;
}

export default function Pagination({ currentPage, totalPage }: IProps) {
  const router = useRouter();
  const pages = getPaginationRange(currentPage, totalPage);

  const handlePage = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    <nav className='w-full flex justify-center gap-[10px] items-center my-9'>
      <ChevronLeft
        className={cn(
          `w-6 aspect-square`,
          currentPage === 1 ? 'text-gray-400' : 'text-black-400 cursor-pointer',
        )}
      />
      {pages.map((page, index) =>
        page === 'dots' ? (
          <div
            key={'dot' + index}
            className='w-12 max-lt:w-[34px] aspect-square flex items-center justify-center'
          >
            <span className='px-2'>…</span>
          </div>
        ) : (
          <div
            key={'page' + page}
            className='w-12 max-lt:w-[34px] aspect-square flex items-center justify-center'
          >
            <button
              onClick={() => handlePage(page)}
              className={`lt:text-2lg max-lt:text-lg cursor-pointer ${
                currentPage === page
                  ? 'text-black-400 font-semibold'
                  : 'text-gray-400 font-normal'
              }`}
            >
              {page}
            </button>
          </div>
        ),
      )}
      <ChevronRight className='w-6 aspect-square cursor-pointer' />
    </nav>
  );
}
