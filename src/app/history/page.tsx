// src/app/history/page.tsx
import { Suspense } from 'react';
import ClientPage from './components/ClinentPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}
