import { mockData } from '@/app/playground/mock';

import ProductCard from './ProductCard';
import Link from 'next/link';
import { Category } from '../gnb/TabMenu';
import { IProducts } from '@/app/productList/page';

interface IProps {
  data: IProducts[],
}

export default function CardList({data}:IProps) {
  return (
    <>
      <div className='w-full grid tb:grid-cols-4 grid-cols-2 gap-6 px-[120px] max-lt:px-[24px]'>
        {data.map((item) => (
          <div key={item.id}>
            <Link href={`/productList/${item.id}`}>
              <ProductCard data={item} />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
