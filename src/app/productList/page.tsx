import { Suspense } from 'react';

import Loading from '@/components/productList/Loading';

import ProductListWrapper from '@/components/productList/ProductListWrapper';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<Loading size='L' />}>
      <ProductListWrapper />
    </Suspense>
  );
}
