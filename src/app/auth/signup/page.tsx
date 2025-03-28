'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signupApi,
  invitationCodeApi,
  invitationSignupApi,
} from '@/app/api/auth/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import Image from 'next/image';

interface InvitedUser {
  email: string;
  name: string;
}

export default function Signup() {
  const router = useRouter();
  const errorFont = 'text-[#F63B20] tb:text-[14px] font-[500] mt-[2px]';

  const searchParams = useSearchParams();
  // URL에 토큰이 있으면 초대 모드로 전환
  const tokenFromUrl = searchParams.get('token');

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState('');

  // 이메일 작성 오류
  const [emailError, setEmailError] = useState<string | null>(null);
  // 빈칸 오류
  const [nullError, setNullError] = useState<{ [key: string]: string }>({});
  // 비밀번호 불일치
  const [passwordError, setPasswordError] = useState('');
  // 비밀번호 눈 껐다켜기
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    validatePassword: false,
  });

  // 초대 모드 여부를 관리하는 상태
  const [isInvitation, setIsInvitation] = useState<boolean>(false);
  // 초대된 사용자 정보 (백엔드 API를 통해 받아온다고 가정)
  const [invitedUser, setInvitedUser] = useState<InvitedUser>({
    email: '',
    name: '',
  });

  // 일반 회원가입 폼 상태
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    validatePassword: '',
    company: '',
    bizno: '',
  });

  // 초대 모드용 폼 (이메일, 비밀번호, 비밀번호 확인만 필요)
  const [clientForm, setClientForm] = useState({
    email: '',
    password: '',
    validatePassword: '',
  });

  // URL에 토큰이 있으면 초대 모드로 전환 및 사용자 정보 설정
  useEffect(() => {
    if (!tokenFromUrl) return;
    setIsInvitation(true);
    invitationCodeApi({ token: tokenFromUrl })
      .then((data) => {
        if (data) {
          setIsTokenValid(true);
          setInvitedUser(data);
          setClientForm((prev) => ({ ...prev, email: data.email }));
        } else {
          setError('유효하지 않은 초대 토큰입니다.');
        }
      })
      .catch((err) => setError(err.msg));
    console.log('clientForm', clientForm);
  }, [tokenFromUrl]);

  // 폼 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (isInvitation) {
      setClientForm((prev) => {
        if (name === 'validatePassword' && prev.password !== value) {
          setPasswordError('비밀번호가 일치하지 않습니다.');
        } else setPasswordError('');
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      setForm((prev) => {
        if (name === 'validatePassword' && prev.password !== value) {
          setPasswordError('비밀번호가 일치하지 않습니다.');
        } else setPasswordError('');
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const toggleVisibility = (field: 'password' | 'validatePassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
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

  const handleNullBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      const placeholder = e.target.placeholder; // 예: "비밀번호를 입력해주세요"
      const match = placeholder.match(/^(.*?(?:을|를))/); // "비밀번호를" 추출
      const fieldLabel = match ? match[0] : placeholder;

      setNullError((prev) => ({
        ...prev,
        [e.target.name]: `${fieldLabel} 입력해주세요`,
      }));
    } else {
      // 값이 있을 경우 해당 필드의 에러 제거
      setNullError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleClick = async () => {
    if (isInvitation) {
      // 초대 모드: 이메일은 이미 채워져 있고, 비밀번호와 비밀번호 확인만 필요
      const { email, password, validatePassword } = clientForm;
      if (!email || !password || !validatePassword) {
        alert('모든 항목을 입력해주세요!');
        return;
      }
      if (password !== validatePassword) {
        alert('비밀번호를 다시 확인해주세요');
        return;
      }
      if (!tokenFromUrl) {
        alert('초대 코드가 없습니다.');
        return;
      }
      console.log('회원가입 성공');
      router.replace(`/auth/login?token=${tokenFromUrl}`);
      invitationSignupApi({ password, token: tokenFromUrl! })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.error(err));
    } else {
      // 최고 관리자 회원가입 모드
      const { name, email, password, validatePassword, company, bizno } = form;
      if (
        !name ||
        !email ||
        !password ||
        !validatePassword ||
        !company ||
        !bizno
      ) {
        alert('모든 항목을 입력해주세요!');
        return;
      }
      if (password !== validatePassword) {
        alert('비밀번호를 다시 확인해주세요');
        return;
      }
      try {
        const res = await signupApi(form);
        console.log('회원가입 응답', res);
        alert(res.msg);
        router.replace('/auth/login');
      } catch (err) {
        console.error(err);
        alert(err);
      }
    }
  };

  // 입력값 유효성 체크
  const isFormValid = isInvitation
    ? Object.values(clientForm).every((value) => (value ?? '').length > 0)
    : Object.values(form).every((value) => (value ?? '').length > 0);

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      <div className='pr-[10px]'>
        {isInvitation ? (
          <>
            <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
              안녕하세요, {invitedUser.name}님!
            </h2>
            <span className='text-[var(--color-gray-600)] text-[14px] tb:text-[20px]'>
              비밀번호를 입력해 회원가입을 완료해주세요.
            </span>
          </>
        ) : (
          <>
            <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
              기업 담당자 회원가입
            </h2>
            <span className='text-[var(--color-gray-600)] text-[14px] tb:text-[20px]'>
              *그룹 내 유저는 기업 담당자의 초대 메일을 통해 가입이 가능합니다.
            </span>
          </>
        )}
      </div>
      <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px]'>
        {/* 초대가 부분이세요 */}
        {isInvitation ? (
          <>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='이메일'
                name='email'
                placeholder='이메일을 입력해주세요'
                onChange={handleChange}
                value={clientForm.email}
                onBlur={handleEmailBlur}
                disabled={true}
              />
              {emailError && <span className={errorFont}>{emailError}</span>}
            </div>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='비밀번호'
                name='password'
                type={passwordVisibility.password ? 'text' : 'password'}
                placeholder='비밀번호를 입력해주세요'
                onChange={handleChange}
                value={clientForm.password}
                onBlur={handleNullBlur}
              >
                <Image
                  src={
                    passwordVisibility.password
                      ? '/icon/lined/visibility-on.svg'
                      : '/icon/lined/visibility-off.svg'
                  }
                  alt={
                    passwordVisibility.password
                      ? '비밀번호 보이기'
                      : '비밀번호 숨기기'
                  }
                  width={24}
                  height={24}
                  onClick={() => toggleVisibility('password')}
                />
              </Input>
              {nullError.password && (
                <span className={errorFont}>{nullError.password}</span>
              )}
            </div>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='비밀번호 확인'
                name='validatePassword'
                type={passwordVisibility.validatePassword ? 'text' : 'password'}
                placeholder='비밀번호를 다시 한 번 입력해주세요'
                onChange={handleChange}
                value={clientForm.validatePassword}
                onBlur={handleNullBlur}
              >
                <Image
                  src={
                    passwordVisibility.validatePassword
                      ? '/icon/lined/visibility-on.svg'
                      : '/icon/lined/visibility-off.svg'
                  }
                  alt={
                    passwordVisibility.validatePassword
                      ? '비밀번호 확인 보이기'
                      : '비밀번호 확인 숨기기'
                  }
                  width={24}
                  height={24}
                  onClick={() => toggleVisibility('validatePassword')}
                />
              </Input>
              {nullError.validatePassword && (
                <span className={errorFont}>{nullError.validatePassword}</span>
              )}
              {passwordError && (
                <span className={errorFont}>{passwordError}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='이름(기업 담당자)'
                name='name'
                placeholder='이름을 입력해주세요'
                onChange={handleChange}
                value={form.name}
                onBlur={handleNullBlur}
              />
              {nullError.name && (
                <span className={errorFont}>{nullError.name}</span>
              )}
            </div>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='이메일'
                name='email'
                placeholder='이메일을 입력해주세요'
                onChange={handleChange}
                onBlur={handleEmailBlur}
                value={form.email}
              />
              {emailError && <span className={errorFont}>{emailError}</span>}
            </div>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='비밀번호'
                name='password'
                type={passwordVisibility.password ? 'text' : 'password'}
                placeholder='비밀번호를 입력해주세요'
                onChange={handleChange}
                value={form.password}
                onBlur={handleNullBlur}
              >
                <Image
                  src={
                    passwordVisibility.password
                      ? '/icon/lined/visibility-on.svg'
                      : '/icon/lined/visibility-off.svg'
                  }
                  alt={
                    passwordVisibility.password
                      ? '비밀번호 보이기'
                      : '비밀번호 숨기기'
                  }
                  width={24}
                  height={24}
                  onClick={() => toggleVisibility('password')}
                />
              </Input>
              {nullError.password && (
                <span className={errorFont}>{nullError.password}</span>
              )}
            </div>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='비밀번호 확인'
                name='validatePassword'
                type={passwordVisibility.validatePassword ? 'text' : 'password'}
                placeholder='비밀번호를 다시 한 번 입력해주세요'
                onChange={handleChange}
                value={form.validatePassword}
                onBlur={handleNullBlur}
              >
                <Image
                  src={
                    passwordVisibility.validatePassword
                      ? '/icon/lined/visibility-on.svg'
                      : '/icon/lined/visibility-off.svg'
                  }
                  alt={
                    passwordVisibility.validatePassword
                      ? '비밀번호 확인 보이기'
                      : '비밀번호 확인 숨기기'
                  }
                  width={24}
                  height={24}
                  onClick={() => toggleVisibility('validatePassword')}
                />
              </Input>
              {nullError.validatePassword && (
                <span className={errorFont}>{nullError.validatePassword}</span>
              )}
              {passwordError && (
                <span className={errorFont}>{passwordError}</span>
              )}
            </div>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='회사명'
                name='company'
                placeholder='회사명을 입력해주세요'
                onChange={handleChange}
                value={form.company}
                onBlur={handleNullBlur}
              />
              {nullError.company && (
                <span className={errorFont}>{nullError.company}</span>
              )}
            </div>
            <div className='flex flex-col gap-[4px]'>
              <Input
                titleClassName='사업자 번호'
                name='bizno'
                placeholder='사업자 번호를 입력해주세요'
                onChange={handleChange}
                value={form.bizno}
                onBlur={handleNullBlur}
              />
              {nullError.bizno && (
                <span className={errorFont}>{nullError.bizno}</span>
              )}
            </div>
          </>
        )}
        <Button
          className='mt-[16px] tb:mt-[40px]'
          filled='orange'
          onClick={handleClick}
          disabled={!isFormValid}
        >
          시작하기
        </Button>
        <div className='flex gap-[4px] mx-auto tb:mt-[8px]'>
          {!isInvitation && (
            <>
              <span className='text-[12px] tb:text-[20px] text-[var(--color-gray-600)]'>
                이미 계정이 있으신가요?
              </span>
              <a className='text-[12px] tb:text-[20px] font-[600] text-[var(--color-primary-400)] underline decoration-1'>
                로그인
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
