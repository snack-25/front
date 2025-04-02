import { Suspense } from 'react';
import ProductList from './ProductList';
import Loading from '@/components/productList/Loading';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<Loading size='L' />}>
      <ProductList />
    </Suspense>
  );
}
