'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { InvitationUser } from './Invitation';
import { SuperAdmin } from './SuperAdmin';

export function SignupContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [_isModalOpen, _setIsModalOpen] = useState(true);

  useEffect(() => {
    if (!tokenFromUrl) {
      setIsTokenValid(true);
    } else {
      setIsTokenValid(false);
    }
  }, [tokenFromUrl]);

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      {isTokenValid ? <SuperAdmin /> : <InvitationUser />}
    </div>
  );
}
