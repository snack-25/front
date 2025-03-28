import { SortDropDown } from '../ui/SortDropDown';

export default function EntryHeader() {
  return (
    <div className='flex items-center justify-between pb-10'>
      <h1 className='lt:text-3xl max-lt:text-xl font-semibold text-black-400'>
        상품 등록 내역
      </h1>
      <SortDropDown />
    </div>
  );
}
