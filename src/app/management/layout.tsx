// app/management/layout.tsx
import React from 'react';

import ManagementTabMenu from '@/components/gnb/ManagementTabMenu';

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
