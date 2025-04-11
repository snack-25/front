'use client';

import { useEffect, useState } from 'react';
import Form from 'next/form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { invitationCodeApi, invitationSignupApi } from '@/app/auth/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import Modal from '@/components/ui/modal/Modal';
import { showCustomToast } from '@/components/ui/Toast/Toast';

interface InvitedUser {
  email: string;
  name: string;
  company: string;
  role: string;
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
    company: '',
    role: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    validatePassword: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmit = async () => {
    if (!form.password.trim() || !form.validatePassword.trim()) {
      showCustomToast({
        label: '비밀번호를 모두 입력해주세요',
        variant: 'error',
      });
      return;
    }

    try {
      const res = await invitationSignupApi({
        token: tokenFromUrl!,
        password: form.password,
      });

      if (res.status === 200) {
        setIsModalOpen(true);
      } else {
        const errorMessage = res?.data.message || '회원가입 실패';
        showCustomToast({
          label: errorMessage,
          variant: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      showCustomToast({
        label: '회원가입 처리 중 오류가 발생했습니다',
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    if (!tokenFromUrl) return;

    invitationCodeApi({ token: tokenFromUrl })
      .then((res) => {
        if (!res.data || !res.data.data) {
          throw new Error('초대 데이터가 없습니다.');
        }
        const data = res.data;
        const { email, name, companyName, role } = data.data;

        if (data) {
          setInvitedUser({
            email: email,
            name: name,
            company: companyName || (data.company && data.company.name) || '',
            role: role,
          });

          setForm({
            email: email ?? '',
            password: '',
            validatePassword: '',
          });
        }
      })
      .catch((err: any) => {
        // 👇 사용자에게 보이지 않아야 할 예외 메시지 처리
        const raw = err?.response?.data?.message || err?.message || '';
        const isUnauthorized = raw.includes('UnauthorizedException');

        const message = isUnauthorized
          ? '초대 토큰이 만료되었습니다.'
          : raw || '초대 정보 조회에 실패했습니다.';

        showCustomToast({
          label: message,
          variant: 'error',
        });

        // ✅ 만료 페이지로 이동 (경로 변경)
        router.replace(
          `/auth/signup/expired?message=${encodeURIComponent(message)}`,
        );
      });
  }, [tokenFromUrl]);

  const isFormValid =
    form.password.trim().length > 0 && form.validatePassword.trim().length > 0;

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
        isModified={!!form[name]}
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
    <div className='flex flex-col mt-[20px] gap-[16px] tb:gap-[36px]'>
      <div className='pr-[10px]'>
        <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
          안녕하세요, {invitedUser.name}님!
        </h2>
        <span className='text-[var(--color-gray-600)] text-[14px] tb:text-[20px]'>
          <span className='font-semibold'>{invitedUser.company}</span>의{' '}
          <span className='font-semibold'>{invitedUser.role}</span>으로
          초대되었어요. <br />
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
        filled={isFormValid ? 'orange' : 'gray'}
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        시작하기
      </Button>
      <div className='flex gap-[4px] mx-auto tb:mt-[8px]'>
        <span className='text-[12px] tb:text-[20px] text-[var(--color-gray-600)]'>
          이미 계정이 있으신가요?
        </span>
        <Link
          href='/auth/login'
          className='text-[12px] tb:text-[20px] font-[600] text-[var(--color-primary-400)] focus:underline hover:underline decoration-1 underline-offset-2'
        >
          로그인
        </Link>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmText='로그인'
        hideCancel={true}
        onConfirm={() => {
          router.replace('/auth/login');
        }}
      >
        <div className='flex flex-col justify-center items-center gap-[24px]'>
          <Image
            src='/img/modal/approved-md.svg'
            alt='회원가입 승인 이미지'
            width={240}
            height={140}
          />
          <h2 className='mt-[24px] text-[24px] font-[700]'>회원가입 성공</h2>
          <div className='gap-[6px] flex flex-col items-center text-[20px] font-[500] text-[#ABABAB]'>
            <span>{invitedUser.name}님, 회원가입을 진심으로 축하드립니다.</span>
            <div className='flex items-center gap-[15px]'>
              <span>회사명: {invitedUser.company}</span>
              <div>|</div>
              <span>직급: {invitedUser.role}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
