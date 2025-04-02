import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { buttonStyle, Category, ulStyle } from './TabMenu';

interface Props {
  parents: Category[];
  currentParentId: string | null;
  onClick: (level: 'parentId', value: string) => void;
}

export default function ParentTab({
  parents,
  currentParentId,
  onClick,
}: Props) {
  if (!parents || parents.length === 0) {
    return null;
  }

  return (
    <ul className={ulStyle}>
      {parents.map((parent) => (
        <li
          key={parent.id}
          className='h-full'
        >
          <motion.button
            type='button'
            whileHover={{ scale: 1.15 }}
            style={{ pointerEvents: 'auto' }}
            className={cn(
              buttonStyle,
              currentParentId === parent.id
                ? 'border-b-primary-400 text-primary-400'
                : '',
            )}
            onClick={() => onClick('parentId', parent.id)}
          >
            {parent.name}
          </motion.button>
        </li>
      ))}
    </ul>
  );
}
