import { Loader2 } from 'lucide-react';

type Size = 'S' | 'L';

interface IProps {
  size: Size;
}

export default function Loading({ size }: IProps) {
  return (
    <>
      {size === 'S' ? (
        <div className='flex justify-center items-center h-full'>
          <Loader2 className='animate-spin text-gray-500' />
        </div>
      ) : (
        <div className='absolute flex justify-center items-center h-full left-1/2 -translate-x-1/2'>
          <Loader2 className='animate-spin text-gray-500 w-[120px] h-[120px]' />
        </div>
      )}
    </>
  );
}
