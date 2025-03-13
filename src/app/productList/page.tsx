import TabMenu from '@/components/gnb/TabMenu';
import CardList from '@/components/productList/CardList';
import { SortDropDown } from '@/components/productList/SortDropDown';

export default function ProductList() {
  return (
    <>
      <TabMenu />
      <div className='w-full h-[98px] max-lt:h-[68px] px-[120px] max-lt:px-6 flex  items-center justify-end'>
        <SortDropDown />
      </div>

      <CardList />
    </>
  );
}
