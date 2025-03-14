import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import { Textarea } from '@/components/ui/TextArea';
import PurchaseItem from '@/components/ui/modal/PurchaseItem';

interface PurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requester: string;
  items: {
    id: string;
    name: string;
    imageUrl: string;
    category: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
}

export default function PurchaseRequestModal({
  isOpen,
  onClose,
  onConfirm,
  requester,
  items,
  totalAmount, // 서버에서 받은 totalAmount 값
}: PurchaseRequestModalProps) {
  const {
    register,
    watch,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });

  const requestMessage = watch('requestMessage', ''); // 입력값 감지

  // 총 금액 검증
  const calculatedTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const [amountError, setAmountError] = useState<string | null>(null);
  useEffect(() => {
    if (totalAmount !== calculatedTotal) {
      setAmountError(
        `❌ 총 요청 구매값(${totalAmount.toLocaleString()}원)과 실제 계산값(${calculatedTotal.toLocaleString()}원)이 다릅니다.`,
      );
    } else {
      setAmountError(null);
    }
  }, [totalAmount, calculatedTotal]);

  return (
    <BaseFormModal
      title='구매 요청'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText='구매 요청하기'
      cancelText='취소'
      confirmButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      cancelButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      confirmDisabled={!isValid} // 메시지 길이가 8자 미만이면 비활성화
      smallSize='w-[375px] h-auto'
      largeSize='md:w-[688px] h-auto'
      // smallSize='w-[375px] h-[962px]'
      // largeSize='md:w-[688px] md:h-[1194px]'
    >
      <div className='flex flex-col gap-5'>
        {/* 요청인 정보 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>요청인</label>
          <Input
            value={requester}
            readOnly
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] bg-gray-100'
          />
        </div>

        {/* 요청 품목 리스트 */}
        <div className='flex flex-col gap-3'>
          <label className='text-[20px] font-semibold'>요청 품목</label>
          <div className='flex flex-col gap-3 border border-[#FCC49C] rounded-xl p-3 bg-white max-h-[250px] overflow-y-auto'>
            {items.map((item) => (
              <PurchaseItem
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </div>

        {/* 총 합계 금액 */}
        <div className='flex justify-between items-center text-[20px] font-semibold border-t border-[#FCC49C] pt-3'>
          <span>총 {items.length}건</span>
          <span className='text-[#F97B22]'>
            {totalAmount.toLocaleString()}원
          </span>
        </div>

        {/* 금액 검증 에러 메시지 */}
        {amountError && (
          <div className='text-red-500 text-sm font-semibold'>
            {amountError}
          </div>
        )}

        {/* 요청 메시지 입력 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>요청 메시지</label>
          <Textarea
            placeholder='요청 메시지를 입력해주세요.'
            value={requestMessage} // ✅ watch로 값 반영
            {...register('requestMessage', {
              required: true,
              minLength: 8,
              onChange: (e) => setValue('requestMessage', e.target.value), // ✅ setValue로 업데이트
            })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[120px]'
          />
        </div>
      </div>
    </BaseFormModal>
  );
}
