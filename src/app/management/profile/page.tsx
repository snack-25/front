'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { updatePasswordApi } from '@/app/auth/api';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import { showCustomToast } from '@/components/ui/Toast/Toast';

interface IError {
  isError: boolean;
  msg: string;
}

const initError: IError = { isError: false, msg: '' };

const initErrors: Record<string, IError> = {
  password: initError,
  validatePassword: initError,
  company: initError,
};

interface IPasswords {
  password: string;
  validatePassword: string;
}

const initForm = {
  company: '',
  password: '',
  validatePassword: '',
};

const validatePasswordFunc = (password: string): string => {
  if (password.length < 8) {
    throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
  }
  if (password.length > 128) {
    throw new Error('비밀번호는 최대 12자 이하여야 합니다.');
  }
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,128}$/;
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    );
  }
  return '사용 가능한 비밀번호입니다.';
};

const errorFont = 'text-[#F63B20] tb:text-[14px] font-[500] mt-[2px]';

export default function Profile() {
  const router = useRouter();
  const { isAuth, edit, user, company } = useAuthStore();

  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState<Record<string, IError>>(initErrors);
  const [passwords, setPasswords] = useState<IPasswords>(initForm);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    validatePassword: false,
  });

  // safeCompany: 회사 정보가 null일 경우 대비
  const safeCompany = useMemo(() => company ?? { companyName: '' }, [company]);
  // safeUser: 사용자 정보 (읽기 전용)
  const safeUser = useMemo(
    () => user ?? { role: '', name: '', email: '' },
    [user],
  );

  // 회사명이 변경되었을 때 기본값 채우기
  useEffect(() => {
    if (safeCompany.companyName) {
      setForm((prev) => ({ ...prev, company: safeCompany.companyName }));
    }
  }, [safeCompany.companyName]);

  // 에러 메시지는 아래 함수에서 렌더링 (하단 텍스트)
  const renderError = (field: string) => {
    return (
      errors[field]?.isError && (
        <span className={errorFont}>{errors[field].msg}</span>
      )
    );
  };

  // 토글: 비밀번호 보이기/숨기기
  const toggleVisibility = (field: 'password' | 'validatePassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, placeholder } = e.target;
    // 값이 비어 있다면 에러 처리
    if (value.trim() === '') {
      const match = placeholder.match(/^(.*?(?:을|를))/);
      const fieldLabel = match ? match[0] : placeholder;
      setErrors((prev) => ({
        ...prev,
        [name]: {
          isError: true,
          msg: `${fieldLabel} 입력해주세요`,
        },
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: { isError: false, msg: '' },
      }));
    }

    // 비밀번호 관련 업데이트는 passwords 상태에 저장
    if (name === 'password' || name === 'validatePassword') {
      setPasswords((prev) => ({ ...prev, [name]: value }));
      // 두 필드가 모두 입력되어 있으면 일치여부 체크
      if (
        passwords.password &&
        passwords.validatePassword &&
        passwords.password !== passwords.validatePassword
      ) {
        setErrors((prev) => ({
          ...prev,
          validatePassword: {
            isError: true,
            msg: '비밀번호가 일치하지 않습니다',
          },
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          validatePassword: { isError: false, msg: '' },
        }));
      }
    }
  };

  // 공통 onChange 핸들러: 비밀번호 입력은 passwords에, 그 외는 form에
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password' || name === 'validatePassword') {
      setPasswords((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const companyChanged =
      form.company.trim() !== safeCompany.companyName.trim();
    const isPasswordProvided =
      !!passwords.password || !!passwords.validatePassword;
    const isPasswordComplete =
      !!passwords.password && !!passwords.validatePassword;

    // 변경 사항이 없으면
    if (!companyChanged && !isPasswordProvided) {
      showCustomToast({
        label: '변경 사항이 없습니다',
        variant: 'error',
        onClick: () => {},
      });
      return;
    }

    // 만약 비밀번호를 업데이트하려는 경우, 두 필드 모두 입력되어야 함.
    if (isPasswordProvided && !isPasswordComplete) {
      showCustomToast({
        label: '비밀번호와 비밀번호 확인을 모두 입력해주세요',
        variant: 'error',
        onClick: () => {},
      });
      return;
    }

    // 비밀번호가 입력된 경우, 두 필드가 일치하는지 확인 및 유효성 검사
    if (isPasswordComplete) {
      if (passwords.password !== passwords.validatePassword) {
        showCustomToast({
          label: '비밀번호가 일치하지 않습니다',
          variant: 'error',
          onClick: () => {},
        });
        return;
      }
      try {
        validatePasswordFunc(passwords.password);
      } catch (err: any) {
        showCustomToast({
          label: err.message || '비밀번호 조건 오류',
          variant: 'error',
          onClick: () => {},
        });
        return;
      }
    }

    const requestBody: { password?: string; company?: string } = {};
    // 비밀번호 업데이트가 있을 때만 추가
    if (isPasswordComplete) {
      requestBody.password = passwords.password;
    }
    // 회사명이 변경되었으면 추가
    if (companyChanged) {
      requestBody.company = form.company.trim();
    }

    updatePasswordApi(requestBody)
      .then((res) => {
        if (res.statusCode && res.statusCode !== 200) {
          throw new Error(res.message || '프로필 변경 실패');
        }
        showCustomToast({
          label: res.message || '프로필 변경 성공',
          variant: 'success',
          onClick: () => {},
        });
        // 초기화: 회사명은 safeCompany 값으로, 비밀번호 필드는 빈 값으로.
        setForm({ ...initForm, company: safeCompany.companyName });
        setPasswords(initForm);
        edit(res.data.company.name);
        router.replace('?');
      })
      .catch((err) => {
        showCustomToast({
          label: err.message || '프로필 변경 실패',
          variant: 'error',
          onClick: () => {},
        });
      });
  };

  // 버튼 활성화 조건: 회사명이 변경되었거나, 비밀번호 관련 필드가 모두 채워졌으면 활성화
  const isCompanyChanged =
    form.company.trim() !== safeCompany.companyName.trim();
  const isPasswordProvided =
    !!passwords.password || !!passwords.validatePassword;
  const isPasswordComplete =
    !!passwords.password && !!passwords.validatePassword;
  const isFormValid =
    isCompanyChanged || (isPasswordProvided && isPasswordComplete);

  const renderInputField = (
    title: string,
    name: string,
    value: string,
    disabled: boolean = false,
    placeholder?: string,
  ) => (
    <div className='flex flex-col gap-[4px]'>
      <Input
        titleClassName={title}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        {...(placeholder ? { placeholder } : {})}
      />
      {renderError(name)}
    </div>
  );

  const renderPasswordField = (
    title: string,
    name: 'password' | 'validatePassword',
    placeholder: string,
    value: string,
    visibility: boolean,
    disabled: boolean = false,
  ) => (
    <div className='flex flex-col gap-[4px]'>
      <Input
        titleClassName={title}
        name={name}
        placeholder={placeholder}
        type={visibility ? 'text' : 'password'}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        disabled={disabled}
      >
        <Image
          src={
            visibility
              ? '/icon/lined/visibility-on.svg'
              : '/icon/lined/visibility-off.svg'
          }
          alt={visibility ? '비밀번호 보이기' : '비밀번호 숨기기'}
          width={24}
          height={24}
          onClick={() => toggleVisibility(name)}
        />
      </Input>
      {renderError(name)}
    </div>
  );

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      <div className='flex flex-col gap-[16px] mt-[20px] tb:gap-[36px]'>
        <div className='pr-[10px]'>
          <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
            내 프로필
          </h2>
        </div>
        {renderInputField(
          '기업명',
          'company',
          form.company,
          safeUser.role !== 'SUPERADMIN',
          '기업명을 입력해주세요',
        )}
        {renderInputField('권한', 'role', safeUser.role, true)}
        {renderInputField('이름', 'name', safeUser.name, true)}
        {renderInputField('이메일', 'email', safeUser.email, true)}
        {renderPasswordField(
          '비밀번호',
          'password',
          '비밀번호를 입력해주세요',
          passwords.password,
          passwordVisibility.password,
        )}
        {renderPasswordField(
          '비밀번호 확인',
          'validatePassword',
          '비밀번호를 다시 한 번 입력해주세요',
          passwords.validatePassword,
          passwordVisibility.validatePassword,
        )}
        <Button
          className='mt-[16px] tb:mt-[40px]'
          filled={isFormValid ? 'orange' : 'gray'}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          변경하기
        </Button>
      </div>
    </div>
  );
}
