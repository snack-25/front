import { Suspense } from 'react';

import Loading from '@/components/productList/Loading';

import ProductList from './ProductList';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<Loading size='L' />}>
      <ProductList />
    </Suspense>
  );
}
