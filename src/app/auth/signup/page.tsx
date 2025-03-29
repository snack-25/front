'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvitationUser } from './Invitation';
import { SuperAdmin } from './SuperAdmin';
import Modal from '@/components/ui/modal/Modal';
import Image from 'next/image';

export default function Signup() {
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
      {isTokenValid ? (
        <SuperAdmin></SuperAdmin>
      ) : (
        <InvitationUser></InvitationUser>
      )}
    </div>
  );
}
