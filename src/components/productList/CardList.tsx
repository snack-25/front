import { mockData } from '@/app/playground/mock';

import ProductCard from './ProductCard';
import Link from 'next/link';

const data = mockData;

export default function CardList() {
  return (
    <>
      <div className='w-full grid mb:grid-cols-4 grid-cols-2 gap-6 px-[120px] max-lt:px-[24px]'>
        {data.map((item) => (
          <div key={item.productId}>
            <Link href={`/productList/${item.productId}`}>
              <ProductCard data={item} />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
