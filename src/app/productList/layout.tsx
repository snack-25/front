import TabMenu from '@/components/gnb/TabMenu';
import PageProvider from '@/components/productList/PageProvider';

interface IProps {
  children: React.ReactNode;
}

export default function ProductListLayout({ children }: IProps) {
  return (
    <>
      <PageProvider>
        <TabMenu />
        <main>{children}</main>
      </PageProvider>
    </>
  );
}
