// app/management/layout.tsx
import ManagementTabMenu from '@/components/gnb/ManagementTabMenu';
import React from 'react';

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-[#FFFBF6] min-h-screen'>
      <ManagementTabMenu />
      {children}
    </div>
  );
}
