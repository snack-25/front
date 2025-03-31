import { SortDropDown } from '../ui/SortDropDown';

export default function EntryHeader() {
  return (
    <div className='flex h-36 max-lt:h-16 max-lt:px-6 items-center justify-between max-lt:border-b-1 max-lt:border-b-line-200'>
      <h1 className='lt:text-3xl max-lt:text-xl font-semibold text-black-400'>
        상품 등록 내역
      </h1>
      <SortDropDown />
    </div>
  );
}
