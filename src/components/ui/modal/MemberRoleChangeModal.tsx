import React from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MemberRoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; email: string; role: string }) => void; // 변경 확정 시 실행되는 함수
  member: { name: string; email: string; role: string }; // 회원 정보 (이름, 이메일, 권한)
}

export default function MemberRoleChangeModal({
  isOpen,
  onClose,
  onConfirm,
  member,
}: MemberRoleChangeModalProps) {
  // useForm 훅을 사용하여 폼 상태 관리
  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: member.name,
      email: member.email,
      role: member.role,
    },
  });

  const selectedRole = watch('role'); // 현재 선택된 권한 상태를 감시
  const isConfirmDisabled = selectedRole === member.role; // 기존 권한과 같으면 비활성화

  return (
    <BaseFormModal
      title='회원 권한 변경'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onConfirm)}
      confirmText='변경하기'
      cancelText='취소'
      confirmDisabled={isConfirmDisabled} // 버튼 비활성화 로직 적용
    >
      {/* 입력 필드 컨테이너 */}
      <div className='flex flex-col gap-6 w-[327px] md:w-[640px]'>
        {/* 이름 입력 필드 (읽기 전용) */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold text-[#1F1F1F]'>
            이름
          </label>
          <Input
            value={member.name}
            readOnly
            className='text-[16px] h-[54px] md:h-[64px] border border-[#FCC49C] bg-gray-100 cursor-not-allowed px-4 rounded-xl'
          />
        </div>

        {/* 이메일 입력 필드 (읽기 전용) */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold text-[#1F1F1F]'>
            이메일
          </label>
          <Input
            value={member.email}
            readOnly
            className='text-[16px] h-[54px] md:h-[64px] border border-[#FCC49C] bg-gray-100 cursor-not-allowed px-4 rounded-xl'
          />
        </div>

        {/* 권한 선택 필드 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold text-[#1F1F1F]'>
            권한
          </label>
          <Select onValueChange={(value) => setValue('role', value)}>
            <SelectTrigger className='text-[16px] w-full h-[54px] md:h-[64px] border border-[#FCC49C] px-4 rounded-xl'>
              <SelectValue placeholder={member.role} />
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
