import { Suspense } from 'react';

import ProductEntry from './ProductEntry';
import Loading from '@/components/productList/Loading';

export default function ProductEntryPage() {
  return (
    <Suspense fallback={<Loading size='L' />}>
      <ProductEntry />
    </Suspense>
  );
}
