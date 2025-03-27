import { motion } from 'framer-motion';
import { buttonStyle, Category, ulStyle } from './TabMenu';
import { cn } from '@/lib/utils';
import Loading from '../productList/Loading';
import { memo } from 'react';

interface Props {
  sub: Category[] | null;
  currentCategoryId: string | null;
  onClick: (level: 'categoryId', value: string) => void;
}

export default function SubTab({ sub, currentCategoryId, onClick }: Props) {
  if (!sub) return <Loading size='S' />;

  return (
    <ul className={ulStyle}>
      {sub.map((item) => (
        <li
          key={item.id}
          className='h-full'
        >
          <motion.button
            type='button'
            whileHover={{ scale: 1.15 }}
            style={{ pointerEvents: 'auto' }}
            className={cn(
              'text-lg font-semibold',
              buttonStyle,
              currentCategoryId === item.id ? 'text-primary-400' : '',
            )}
            onClick={() => onClick('categoryId', item.id)}
          >
            {item.name}
          </motion.button>
        </li>
      ))}
    </ul>
  );
}
