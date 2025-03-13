import React from 'react';
import { useForm } from 'react-hook-form';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; email: string; role: string }) => void;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  onConfirm,
}: InviteMemberModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: '관리자', // 기본값 설정
    },
    mode: 'onChange',
  });

  const isConfirmDisabled =
    watch('name').length < 3 ||
    watch('email').length < 5 ||
    !!errors.email ||
    !!errors.name;

  return (
    <BaseFormModal
      title='회원 초대'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onConfirm)}
      confirmText='등록하기'
      cancelText='취소'
      confirmDisabled={isConfirmDisabled}
      showCloseButton={false}
    >
      {/* 입력 필드 */}
      <div className='flex flex-col gap-6'>
        {/* 이름 */}
        <div className='flex flex-col gap-2 w-[327px] md:w-[640px]'>
          <label className='text-[20px] font-semibold text-[#1F1F1F]'>
            이름
          </label>
          <Input
            placeholder='이름을 입력해주세요'
            {...register('name', {
              required: '이름을 입력해주세요.',
              minLength: {
                value: 3,
                message: '이름은 최소 3자 이상 입력해야 합니다.',
              },
            })}
            className='text-[16px] w-full h-[54px] md:h-[64px] border border-[#FCC49C] rounded-xl px-4'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>

        {/* 이메일 */}
        <div className='flex flex-col gap-2 w-[327px] md:w-[640px]'>
          <label className='text-[20px] font-semibold text-[#1F1F1F]'>
            이메일
          </label>
          <Input
            placeholder='이메일을 입력해주세요'
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: '올바른 이메일 형식이 아닙니다.',
              },
            })}
            className='text-[16px] w-full h-[54px] md:h-[64px] border border-[#FCC49C] rounded-xl px-4'
          />
          {errors.email && (
            <p className='text-red-500 text-sm'>{errors.email.message}</p>
          )}
        </div>

        {/* 권한 선택 */}
        <div className='flex flex-col gap-2 w-[327px] md:w-[640px]'>
          <label className='text-[20px] font-semibold text-[#1F1F1F]'>
            권한
          </label>
          <Select {...register('role')}>
            <SelectTrigger className='text-[16px] w-full h-[54px] md:h-[64px] border border-[#FCC49C] rounded-xl px-4'>
              <SelectValue placeholder='관리자' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='최종 관리자'>최종 관리자</SelectItem>
              <SelectItem value='관리자'>관리자</SelectItem>
              <SelectItem value='일반 유저'>일반 유저</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseFormModal>
  );
}
