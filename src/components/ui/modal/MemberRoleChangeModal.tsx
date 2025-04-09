'use client';

import { useEffect,useState } from 'react';
import { CheckIcon,ChevronDownIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import { Listbox } from '@headlessui/react';

interface MemberRoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; email: string; role: string }) => void;
  member: { name: string; email: string; role: string };
}

// 권한 옵션 정의
const roleOptions = [
  { value: 'SUPERADMIN', label: '최종 관리자' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'USER', label: '일반 유저' },
];

export default function MemberRoleChangeModal({
  isOpen,
  onClose,
  onConfirm,
  member,
}: MemberRoleChangeModalProps) {
  if (!member) {return null;}

  const { handleSubmit } = useForm();

  // 현재 선택된 권한 상태 관리
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);

  // 🔁 초기값 세팅
  useEffect(() => {
    const initialRole = roleOptions.find((r) => r.value === member.role);
    if (initialRole) {setSelectedRole(initialRole);}
  }, [member]);

  // ✅ 버튼 비활성화 조건: 동일한 권한이면 비활성화
  const isConfirmDisabled = selectedRole.value === member.role;

  return (
    <BaseFormModal
      title='회원 권한 변경'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() =>
        onConfirm({
          name: member.name,
          email: member.email,
          role: selectedRole.value,
        })
      }
      confirmText='변경하기'
      cancelText='취소'
      confirmDisabled={isConfirmDisabled}
      smallSize='w-[375px] h-[524px]'
      largeSize='md:w-[688px] md:h-[672px]'
      confirmButtonProps='w-[150px] h-[50px] md:w-[300px] md:h-[64px]'
      cancelButtonProps='w-[150px] h-[50px] md:w-[300px] md:h-[64px]'
    >
      <div className='flex flex-col gap-10 md:gap-16 w-[327px] md:w-[640px]'>
        {/* 이름 (읽기 전용) */}
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

        {/* 이메일 (읽기 전용) */}
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

        {/* 권한 선택 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold text-[#1F1F1F]'>
            권한
          </label>
          <Listbox
            value={selectedRole}
            onChange={setSelectedRole}
          >
            <div className='relative'>
              <Listbox.Button className='flex items-center justify-between w-full h-[54px] md:h-[64px] px-4 border border-[#FCC49C] rounded-xl bg-white text-left'>
                <span className='text-[16px]'>{selectedRole.label}</span>
                <ChevronDownIcon className='w-4 h-4 text-orange-500' />
              </Listbox.Button>
              <Listbox.Options className='absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border bg-white shadow-md'>
                {roleOptions.map((role) => (
                  <Listbox.Option
                    key={role.value}
                    value={role}
                    className={({ active }) =>
                      `px-4 py-2 cursor-pointer ${active ? 'bg-orange-100' : ''}`
                    }
                  >
                    {({ selected }) => (
                      <span className='flex justify-between items-center text-sm'>
                        {role.label}
                        {selected && (
                          <CheckIcon className='w-4 h-4 text-orange-500' />
                        )}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
    </BaseFormModal>
  );
}
