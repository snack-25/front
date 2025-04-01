import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { InvitationUser } from './Invitation';
import { SuperAdmin } from './SuperAdmin';

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  /**
   * useSearchParams() should be wrapped in a suspense boundary at page "/auth/signup".
   * Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
   * useSearchParams()에 대한 호출은 Suspense 경계로 감싸져 있어야 함
   **/
  // 1. 기존 Signup 컴포넌트의 useSearchParams 관련 로직을 여기로 이동
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [_isModalOpen, _setIsModalOpen] = useState(true);

  useEffect(() => {
    // URL에 토큰이 없으면 유효하다고 간주 (최초 관리자 등록 등)
    if (!tokenFromUrl) {
      setIsTokenValid(true);
    } else {
      // 실제로는 여기서 토큰 유효성 검사 로직이 필요
      // 임시로 토큰이 있으면 유효하지 않다고 가정하는 로직 유지
      setIsTokenValid(false); // tokenFromUrl이 있으면 초대 플로우로 간주 (기존 로직 유지)
    }
  }, [tokenFromUrl]);

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
