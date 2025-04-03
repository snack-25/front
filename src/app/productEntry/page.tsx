import { Suspense } from 'react';

import Loading from '@/components/productList/Loading';

import ProductEntry from './ProductEntry';

export default function ProductEntryPage() {
  return (
    <Suspense fallback={<Loading size='L' />}>
      <ProductEntry />
    </Suspense>
  );
}
