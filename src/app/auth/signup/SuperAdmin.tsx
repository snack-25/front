'use client';

import { Input } from '@/components/ui/Input_auth';
import Image from 'next/image';

export function SuperAdmin({
  handleChange,
  form,
  errorFont,
  nullErro,
  handleNullBlur,
  handleEmailBlur,
}) {
  return (
    <>
      <>
        <h2 className='text-[24px] tb:text-[32px] font-semibold tb:mb-[12px]'>
          기업 담당자 회원가입
        </h2>
        <span className='text-[var(--color-gray-600)] text-[14px] tb:text-[20px]'>
          *그룹 내 유저는 기업 담당자의 초대 메일을 통해 가입이 가능합니다.
        </span>
      </>
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
          {passwordError && <span className={errorFont}>{passwordError}</span>}
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
    </>
  );
}
