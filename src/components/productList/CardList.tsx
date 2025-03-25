import Link from 'next/link';
import { motion } from 'framer-motion';
import { IProducts } from '@/app/productList/page';
import ProductCard from './ProductCard';

interface IProps {
  data: IProducts[];
}

export default function CardList({ data }: IProps) {
  return (
    <>
      <div className='w-full grid tb:grid-cols-4 grid-cols-2 gap-6 px-[120px] max-lt:px-[24px]'>
        {data.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link href={`/productList/${item.id}`}>
              <ProductCard data={item} />
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
