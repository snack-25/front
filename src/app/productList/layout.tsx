import { PropsWithChildren } from 'react';
import ProductProvider from '@/components/productList/ProductProvider';

export default function ProductListLayout({ children }: PropsWithChildren) {
  return (
    <ProductProvider>
        <main>{children}</main>
    </ProductProvider>
  );
}
