'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvitationUser } from './Invitation';
import { SuperAdmin } from './SuperAdmin';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (!tokenFromUrl) {
      setIsTokenValid(true);
    }
  }, []);

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      {isTokenValid ? (
        <SuperAdmin></SuperAdmin>
      ) : (
        <InvitationUser></InvitationUser>
      )}
    </div>
  );
}
