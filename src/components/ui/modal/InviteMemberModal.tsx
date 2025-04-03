import { useState } from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import { Listbox } from '@headlessui/react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; email: string; role: string }) => void;
}

// 권한 목록 (value는 서버에 보낼 값, label은 사용자에게 보여지는 이름)
const roleOptions = [
  { value: 'SUPERADMIN', label: '최종 관리자' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'USER', label: '일반 유저' },
];

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
    },
    mode: 'onChange',
  });

  // 선택된 권한 상태 관리
  const [selectedRole, setSelectedRole] = useState(roleOptions[1]); // 기본값: 관리자

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
      onConfirm={handleSubmit((data) =>
        onConfirm({
          ...data,
          role: selectedRole.value, // 실제 서버에 보낼 enum 값
        }),
      )}
      confirmText='등록하기'
      cancelText='취소'
      confirmDisabled={isConfirmDisabled}
      showCloseButton={false}
      smallSize='w-[375px] h-[500px]'
      largeSize='md:w-[688px] md:h-[664px]'
      confirmButtonProps='w-[140px] h-[50px] md:w-[280px] md:h-[60px]'
      cancelButtonProps='w-[140px] h-[50px] md:w-[280px] md:h-[60px]'
    >
      {/* 입력 필드 */}
      <div className='flex flex-col gap-6 md:gap-16'>
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
