'use client';
import React, { useState } from 'react';

import { loginApi } from '@/app/api/auth/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const errorFont = 'text-[#F63B20] tb:text-[14px] font-[500] mt-[2px]';

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [nullError, setNullError] = useState<string>('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;

    const emailRegex =
      /^(?<localPart>(?<dotString>[0-9a-z!#$%&'*+-/=?^_`{|}~\u{80}-\u{10FFFF}]+(\.[0-9a-z!#$%&'*+-/=?^_`{|}~\u{80}-\u{10FFFF}]+)*)|(?<quotedString>"([\x20-\x21\x23-\x5B\x5D-\x7E\u{80}-\u{10FFFF}]|\\[\x20-\x7E])*"))(?<!.{64,})@(?<domainOrAddressLiteral>(?<addressLiteral>\[((?<IPv4>\d{1,3}(\.\d{1,3}){3})|(?<IPv6Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){7})|(?<IPv6Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?)|(?<IPv6v4Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){5}:\d{1,3}(\.\d{1,3}){3})|(?<IPv6v4Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3}:)?\d{1,3}(\.\d{1,3}){3})|(?<generalAddressLiteral>[a-z0-9-]*[[a-z0-9]:[\x21-\x5A\x5E-\x7E]+))\])|(?<Domain>(?!.{256,})(([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))(\.([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))*))$/iu;

    // console.log(emailRegex);
    if (!emailRegex.test(email)) {
      setEmailError('유효한 이메일을 입력하세요');
      console.log('되는거');
    } else {
      setEmailError(null);
      console.log('안 되는거');
    }
  };

  const handleNullBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      const placeholder = e.target.placeholder; // ex) "비밀번호를 입력해주세요"
      const firstWord = placeholder.split(' ')[0]; // 첫 단어 추출 ("비밀번호를")

      // 조사 자동 추가 (받침 여부에 따라 '을' 또는 '를' 선택)
      // const lastChar = firstWord.charAt(firstWord.length - 1);
      // const hasBatchim = (lastChar.charCodeAt(0) - 44032) % 28 !== 0;
      // const postposition = hasBatchim ? '을' : '를'; // 받침 있으면 '을', 없으면 '를'

      setNullError(`${firstWord} 입력해주세요`);
    }
  };

  const handleClick = () => {
    const { email, password } = form;
    console.log('email', email);

    if (!email || !password) {
      alert('모든 항목을 입력해주세요!');
      return;
    }

    loginApi(form)
      .then((res) => {
        console.log('왜 안 나와', form);
        console.log('로그인 데이터', res);
        alert(res.msg);
        router.replace('/productList');
      })
      .catch((err) => {
        console.error('로그인 오류', err);
        alert(err);
      });
  };

  const isFormValid = Object.values(form).every((value) => value.length > 0);

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col '>
      <div className='pr-[10px]'>
        <h2 className='text-[24px] tb:text-[32px] font-semibold text-center'>
          로그인
        </h2>
      </div>
      <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px] '>
        <div className='flex flex-col gap-[4px]'>
          <Input
            titleClassName='이메일'
            name='email'
            placeholder='이메일을 입력해주세요'
            onChange={handleChange}
            onBlur={handleEmailBlur}
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
            value={form.password}
            onBlur={handleNullBlur}
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
              onClick={() => {
                setPasswordVisibility((prev) => !prev);
              }}
            />
          </Input>
          {nullError && <span className={errorFont}>{nullError}</span>}
          <Button
            className='mt-[16px] tb:mt-[40px]'
            filled={isFormValid ? 'orange' : 'gray'}
            onClick={handleClick}
          >
            시작하기
          </Button>
          <div className='flex gap-[4px] mx-auto tb:mt-[8px]'>
            <span className='text-[12px tb:text-[20px] text-[var(--color-gray-600)]'>
              기업 담당자이신가요?
            </span>
            <a className='text-[12px] tb:text-[20px] font-[600] text-[var(--color-primary-400)] underline decoration-1'>
              가입하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
