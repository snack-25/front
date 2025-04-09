import TabMenu from '@/components/gnb/TabMenu';
import ClientWrapper from '@/components/wrappers/ClientWrapper';

interface IProps {
  children: React.ReactNode;
}

export default function ProductListLayout({ children }: IProps) {
  return (
    <>
      <ClientWrapper>
        <TabMenu />
        <main className='p-2 pt-8'>{children}</main>
      </ClientWrapper>
    </>
  );
}
