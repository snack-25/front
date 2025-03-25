'use client';
import React, { useState, useEffect } from 'react';
import { loginApi, invitationCodeApi } from '@/app/api/auth/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface InvitedUser {
  email: string;
  name: string;
}

export default function Login() {
  const router = useRouter();
  const errorFont = 'text-[#F63B20] tb:text-[14px] font-[500] mt-[2px]';

  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nullError, setNullError] = useState<string>('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const [invitedUser, setInvitedUser] = useState<InvitedUser>({
    email: '',
    name: '',
  });

  useEffect(() => {
    if (!tokenFromUrl) return;
    invitationCodeApi({ token: tokenFromUrl })
      .then((data) => {
        if (data) {
          setInvitedUser({ email: data.email, name: data.name });
          setForm((prev) => ({ ...prev, email: data.email }));
        } else {
          setError('유효하지 않은 초대 토큰입니다.');
        }
      })
      .catch((err) => setError(err.msg));
  }, [tokenFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      emailRegex.test(e.target.value) ? null : '유효한 이메일을 입력하세요',
    );
  };

  const handleNullBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'password' && e.target.value === '') {
      setNullError('비밀번호를 입력해주세요');
    } else {
      setNullError('');
    }
  };

  const handleClick = () => {
    if (!form.email || !form.password) {
      alert('모든 항목을 입력해주세요!');
      return;
    }

    loginApi(form)
      .then((res) => {
        alert(res.msg);
        router.replace('/');
      })
      .catch((err) => {
        console.error('로그인 오류', err);
        alert(err);
      });
  };

  const isFormValid = tokenFromUrl
    ? invitedUser.email.length > 0 && form.password.length > 0
    : form.email.length > 0 && form.password.length > 0;

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      <div className='pr-[10px]'>
        <h2 className='text-[24px] tb:text-[32px] font-semibold text-center'>
          로그인
        </h2>
      </div>
      <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px]'>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='이메일'
            name='email'
            placeholder='이메일을 입력해주세요'
            onChange={handleChange}
            onBlur={handleEmailBlur}
            value={form.email}
            disabled={!!tokenFromUrl} // 초대된 경우 입력 비활성화
          />
          {emailError && <span className={errorFont}>{emailError}</span>}
        </div>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='비밀번호'
            name='password'
            type={passwordVisibility ? 'text' : 'password'}
            placeholder='비밀번호를 입력해주세요'
            onChange={handleChange}
            onBlur={handleNullBlur}
            value={form.password}
          >
            <Image
              src={
                passwordVisibility
                  ? '/icon/lined/visibility-on.svg'
                  : '/icon/lined/visibility-off.svg'
              }
              alt={passwordVisibility ? '비밀번호 보이기' : '비밀번호 숨기기'}
              width={24}
              height={24}
              onClick={() => setPasswordVisibility((prev) => !prev)}
            />
          </Input>
          {nullError && <span className={errorFont}>{nullError}</span>}
        </div>
        <Button
          className='mt-[16px] tb:mt-[40px]'
          filled='orange'
          onClick={handleClick}
          disabled={!isFormValid}
        >
          시작하기
        </Button>
        <div className='flex gap-[4px] mx-auto tb:mt-[8px]'>
          <span className='text-[12px] tb:text-[20px] text-[var(--color-gray-600)]'>
            기업 담당자이신가요?
          </span>
          <a className='text-[12px] tb:text-[20px] font-[600] text-[var(--color-primary-400)] underline decoration-1'>
            가입하기
          </a>
        </div>
      </div>
    </div>
  );
}
