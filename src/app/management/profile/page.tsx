'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';

interface IError {
  isError: boolean;
  msg: string;
}

const initError: IError = { isError: false, msg: '' };

const initErrors: Record<string, IError> = {
  name: initError,
  email: initError,
  password: initError,
  validatePassword: initError,
  company: initError,
  bizno: initError,
};

interface IPasswords {
  password: string;
  validatePassword: string;
}

const initForm = {
  name: '',
  email: '',
  password: '',
  validatePassword: '',
  company: '',
  bizno: '',
};

const initDisabled = {
  name: '',
  email: '',
  company: '',
  role: '',
};

const errorFont = 'text-[#F63B20] tb:text-[14px] font-[500] mt-[2px]';

export default function Profile() {
  const [form, setForm] = useState(initForm);
  const [disabled, setDisabled] = useState(initDisabled);
  const [emailError, setEmailError] = useState<IError>(initError);
  const [passwords, setPasswords] = useState<IPasswords>(initForm);
  const [errors, setErrors] = useState<Record<string, IError>>(initErrors);
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
    if (field === 'email') {
      return (
        emailError.isError && (
          <span className={errorFont}>{emailError.msg}</span>
        )
      );
    }
    return (
      errors[field]?.isError && (
        <span className={errorFont}>{errors[field].msg}</span>
      )
    );
  };

  const handleSubmit = () => {
    // form 객체 내 하나라도 비어있는 값이 있으면 알림 표시 후 중단
    if (Object.values(form).some((value) => !value.trim())) {
      alert('모든 항목을 입력해주세요!');
      return;
    }
  };

  const renderInputField = (
    title: string,
    name: string,
    placeholder: string,
    value: string,
    type: string = 'text',
  ) => (
    <div className='flex flex-col gap-[4px]'>
      <Input
        titleClassName={title}
        name={name}
        placeholder={placeholder}
        type={type}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
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

  const isFormValid = Object.values(form).every(
    (value) => (value ?? '').length > 0,
  );

  return (
    <div className='py-[80px] tb:pb-[100px] px-[24px] tb:max-w-[640px] m-auto flex flex-col'>
      <div className='flex flex-col gap-[16px] mt-[40px] tb:mt-[80px] tb:gap-[36px]'>
        <div className='pr-[10px]'>
          <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
            기업 담당자 회원가입
          </h2>
          <span className='text-[var(--color-gray-600)] text-[14px] tb:text-[20px]'>
            *그룹 내 유저는 기업 담당자의 초대 메일을 통해 가입이 가능합니다.
          </span>
        </div>

        {renderInputField('기업명', 'name', '이름을 입력해주세요', form.name)}
        {/* {renderInputField('이메일', 'email', form.email, disabled.email, true)} */}
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
        {renderInputField(
          '회사명',
          'company',
          '회사명을 입력해주세요',
          form.company,
        )}
        {renderInputField(
          '사업자 번호',
          'bizno',
          '사업자 번호를 입력해주세요',
          form.bizno,
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
