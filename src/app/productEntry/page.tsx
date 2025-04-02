import { Suspense } from 'react';

import ProductEntry from './ProductEntry';

export default function ProductEntryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductEntry />
    </Suspense>
  );
}
