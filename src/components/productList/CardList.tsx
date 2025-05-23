'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

import { IProducts } from '@/app/productList/ProductList';

import ProductCard from './ProductCard';

interface IProps {
  data: IProducts[];
}

export default function CardList({ data }: IProps) {
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parentId');
  const categoryId = searchParams.get('categoryId');
  return (
    <>
      <div className='w-full grid tb:grid-cols-4 grid-cols-2 gap-6 px-[120px] max-lt:px-[24px]'>
        {data.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ pointerEvents: 'auto' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <Link
              href={`/productList/${item.id}/detail?parentId=${parentId}&categoryId=${categoryId}`}
            >
              <ProductCard data={item} />
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
