import TabMenu from '@/components/gnb/TabMenu';

interface IProps {
  children: React.ReactNode;
}

export default function ProductListLayout({ children }: IProps) {
  return (
    <>
      <TabMenu />
      <main>{children}</main>
    </>
  );
}
