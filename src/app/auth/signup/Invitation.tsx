'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { invitationCodeApi, invitationSignupApi } from '@/app/api/auth/api';
import Image from 'next/image';

interface InvitedUser {
  email: string;
  name: string;
}

interface IError {
  isError: boolean;
  msg: string;
}

const initError: IError = { isError: false, msg: '' };

const errorFont = 'text-[#F63B20] tb:text-[14px] font-[500] mt-[2px]';

export function InvitationUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [form, setForm] = useState({
    email: '',
    password: '',
    validatePassword: '',
  });

  const [errors, setErrors] = useState({
    password: initError,
    validatePassword: initError,
  });

  const [invitedUser, setInvitedUser] = useState<InvitedUser>({
    email: '',
    name: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    validatePassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error: IError = initError;

    if (!value.trim()) {
      error = { isError: true, msg: '비밀번호를 입력해주세요' };
    } else if (
      (name === 'password' &&
        form.validatePassword &&
        value !== form.validatePassword) ||
      (name === 'validatePassword' && form.password && value !== form.password)
    ) {
      error = { isError: true, msg: '비밀번호를 다시 한 번 확인해주세요' };
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const toggleVisibility = (field: 'password' | 'validatePassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = () => {
    if (Object.values(form).some((value) => !value.trim())) {
      alert('모든 항목을 입력해주세요!');
      return;
    }

    invitationSignupApi({
      token: tokenFromUrl!,
      password: form.password,
    })
      .then((res) => {
        if (res.msg === '회원가입 실패') {
          throw new Error('회원가입 실패'); // 예외를 던져서 .catch()로 보냄
        }

        console.log(res);
        alert('회원가입이 완료되었습니다!');
        router.replace('/auth/login');
      })
      .catch((err) => {
        console.error(err);
        alert('실패다'); // 실패한 경우, 여기에서만 실행됨
      });
  };

  useEffect(() => {
    console.log('토큰', tokenFromUrl);
    if (!tokenFromUrl) {
      console.log('토큰이 존재하지 않습니다.');
      return;
    }

    invitationCodeApi({ token: tokenFromUrl })
      .then((data) => {
        if (data) {
          setInvitedUser(data);
          setForm((prev) => ({ ...prev, email: data.email || '' }));
        } else {
          console.log('유효하지 않은 초대 토큰입니다.');
        }
      })
      .catch((err) => console.error(err.msg));
  }, []);

  const isFormValid = Object.values(form).every(
    (value) => (value ?? '').length > 0,
  );

  const renderPasswordField = (
    name: 'password' | 'validatePassword',
    placeholder: string,
  ) => (
    <div className='flex flex-col gap-[4px]'>
      <Input
        titleClassName={name === 'password' ? '비밀번호' : '비밀번호 확인'}
        name={name}
        type={passwordVisibility[name] ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={handleChange}
        value={form[name]}
        onBlur={handleBlur}
      >
        <Image
          src={
            passwordVisibility[name]
              ? '/icon/lined/visibility-on.svg'
              : '/icon/lined/visibility-off.svg'
          }
          alt={passwordVisibility[name] ? '비밀번호 보이기' : '비밀번호 숨기기'}
          width={24}
          height={24}
          onClick={() => toggleVisibility(name)}
        />
      </Input>
      {errors[name].isError && (
        <span className={errorFont}>{errors[name].msg}</span>
      )}
    </div>
  );

  return (
    <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px]'>
      <div className='pr-[10px]'>
        <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
          안녕하세요, {invitedUser.name}님!
        </h2>
        <span className='text-[var(--color-gray-600)] text-[14px] tb:text-[20px]'>
          비밀번호를 입력해 회원가입을 완료해주세요.
        </span>
      </div>
      <div className='flex flex-col gap-[4px]'>
        <Input
          titleClassName='이메일'
          name='email'
          placeholder={invitedUser.email}
          value={form.email}
          disabled
        />
      </div>
      {renderPasswordField('password', '비밀번호를 입력해주세요')}
      {renderPasswordField(
        'validatePassword',
        '비밀번호를 다시 한 번 입력해주세요',
      )}
      <Button
        className='mt-[16px] tb:mt-[40px]'
        filled='orange'
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        시작하기
      </Button>
    </div>
  );
}
