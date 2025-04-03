'use client';

import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import Image from 'next/image';

import { updatePasswordApi } from '@/app/api/auth/api';
import { useAuthStore } from '@/app/api/auth/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';

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

const errorFont = 'text-[#F63B20] tb:text-[14px] font-[500] mt-[2px]';

export default function Profile() {
  const { isAuth, user, company } = useAuthStore();

  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState<Record<string, IError>>(initErrors);

  const [passwords, setPasswords] = useState<IPasswords>(initForm);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    validatePassword: false,
  });

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, placeholder } = e.target;
    let newError: IError = initError;

    if (value === '') {
      const match = placeholder.match(/^(.*?(?:을|를))/);
      const fieldLabel = match ? match[0] : placeholder;
      newError = { isError: true, msg: `${fieldLabel} 입력해주세요` };
    } else if (name === 'password' || name === 'validatePassword') {
      const newPasswords = { ...passwords, [name]: value };
      setPasswords(newPasswords);
      if (
        (name === 'password' &&
          newPasswords.validatePassword &&
          value !== newPasswords.validatePassword) ||
        (name === 'validatePassword' &&
          newPasswords.password &&
          value !== newPasswords.password)
      ) {
        newError = { isError: true, msg: '비밀번호를 다시 한 번 확인해주세요' };
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newError,
    }));
  };

  // 공통 onChange 핸들러 (사업자 번호는 별도 처리)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field: 'password' | 'validatePassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderError = (field: string) => {
    return (
      errors[field]?.isError && (
        <span className={errorFont}>{errors[field].msg}</span>
      )
    );
  };

  const handleSubmit = () => {
    // 필수 값 검증 (비밀번호가 비어있으면 중단)
    if (!form.password.trim()) {
      alert('비밀번호를 입력해주세요!');
      return;
    }

    // 보낼 데이터 결정 (기업명 변경 여부 확인)
    const requestBody: { password: string; company?: string } = {
      password: form.password, // 비밀번호는 항상 포함
    };

    if (form.company !== safeCompany.name) {
      requestBody.company = form.company; // 기업명이 변경된 경우에만 포함
    }

    // 변경할 내용이 없으면 API 요청하지 않음
    if (!requestBody.company && !requestBody.password) {
      alert('변경된 사항이 없습니다.');
      return;
    }

    updatePasswordApi(requestBody)
      .then((res) => {
        if (!res.ok) {
          throw new Error('비밀번호 변경 실패');
        }
        console.log('성공res', res);
        alert('비밀번호 변경 성공!');
      })
      .catch((err) => {
        console.error(err);
        alert('비밀번호 변경 실패!');
      });

    console.log('보낸 데이터:', requestBody);
  };

  const renderInputField = (
    title: string,
    name: string,
    value: string,
    disabled: boolean = false,
    placeholder?: string, // 선택적 속성으로 변경
  ) => (
    <div className='flex flex-col gap-[4px]'>
      <Input
        titleClassName={title}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        {...(placeholder ? { placeholder } : {})} // placeholder가 있을 때만 추가
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

  // company가 변경될 때만 safeCompany를 다시 계산
  const safeCompany = useMemo(() => company ?? { name: '' }, [company]);
  // user가 변경될 때만 safeUser를 다시 계산
  const safeUser = useMemo(
    () => user ?? { role: '', name: '', email: '' },
    [user],
  );

  // company 값이 바뀌면 form.company도 업데이트하도록 설정
  useEffect(() => {
    setForm((prev) => ({ ...prev, company: safeCompany.name }));
  }, [safeCompany.name]);

  const isFormValid = Object.values(form).every(
    (value) => (value ?? '').length > 0,
  );

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px]'>
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
          form.password,
          passwordVisibility.password,
        )}
        {renderPasswordField(
          '비밀번호 확인',
          'validatePassword',
          '비밀번호를 다시 한 번 입력해주세요',
          form.validatePassword,
          passwordVisibility.validatePassword,
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
    </div>
  );
}
