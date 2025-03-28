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
      <div>
        <button onClick={() => setIsModalOpen(true)}>모달 열기</button>
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          confirmText='확인'
          cancelText='닫기'
        >
          <div className='flex flex-col justify-center items-center gap-[36px]'>
            <div className='flex flex-col items-center '>
              <h2 className='mb-[10px] text-[40px] font-[600] text-[#F97B22]'>
                회원가입 성공
              </h2>
              <span className='text-[20px] '>
                이름님, 회원가입을 진심으로 축하드립니다.
              </span>
            </div>
            <Image
              src='/img/modal/approved-md.svg'
              alt='강아지 승인 사진'
              width={240}
              height={140}
            />
            <div className='flex items-center gap-[15px] text-[18px]'>
              <span className=''>회사명: 개짱회사</span>
              <div>|</div>
              <span className=''>직급: 최고관리자</span>
            </div>
          </div>
        </Modal>
        {/* <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          confirmText='확인'
          cancelText='닫기'
        >
          <div className='flex flex-col justify-center items-center gap-[24px]'>
            <Image
              src='/img/modal/approved-md.svg'
              alt='강아지 승인 사진'
              width={240}
              height={140}
            />
            <h2 className='mt-[24px] text-[24px] font-[700]'>회원가입 성공</h2>
            <div className='gap-[6px] flex flex-col items-center text-[20px] font-[500] text-[#ABABAB]'>
              <span className=''>
                이름님, 회원가입을 진심으로 축하드립니다.
              </span>
              <div className='flex items-center gap-[15px]'>
                <span className=''>회사명: 개짱회사</span>
                <div>|</div>
                <span className=''>직급: 최고관리자</span>
              </div>
            </div>
          </div>
        </Modal> */}
      </div>

      {isTokenValid ? (
        <SuperAdmin></SuperAdmin>
      ) : (
        <InvitationUser></InvitationUser>
      )}
    </div>
  );
}
