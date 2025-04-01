'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';

import { InvitationUser } from './Invitation';
import { SuperAdmin } from './SuperAdmin';

export default function Signup() {
  /**
   * useSearchParams() should be wrapped in a suspense boundary at page "/auth/signup".
   * Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
   * useSearchParams()에 대한 호출은 Suspense 경계로 감싸져 있어야 함
   **/
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (!tokenFromUrl) {
      setIsTokenValid(true);
    }
  }, []);

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      <Suspense fallback={<div>Loading...</div>}>
        {isTokenValid ? (
          <SuperAdmin></SuperAdmin>
        ) : (
          <InvitationUser></InvitationUser>
        )}
      </Suspense>
    </div>
  );
}
