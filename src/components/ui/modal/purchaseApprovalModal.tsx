'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import PurchaseItem from '@/components/ui/modal/PurchaseItem';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/TextArea';

interface PurchaseApprovalModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: (message: string) => void;
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
  budgetLeft?: number; // ✅ budgetLeft를 선택적으로 받을 수 있도록 수정 -> 임시시
}

export default function PurchaseApprovalModal({
  isOpen,
  onCloseAction,
  onConfirmAction,
  requester,
  items,
  totalAmount,
  budgetLeft,
}: PurchaseApprovalModalProps) {
  const {
    register,
    watch,
    setValue,
    formState: { isValid },
  } = useForm({ mode: 'onChange' });

  const approvalMessage = watch('approvalMessage', '');

  const calculatedTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const [amountError, setAmountError] = useState<string | null>(null);
  const isOverBudget = budgetLeft !== undefined && totalAmount > budgetLeft;

  useEffect(() => {
    if (totalAmount !== calculatedTotal) {
      setAmountError(
        `❌ 총 금액(${totalAmount.toLocaleString()}원)과 계산 금액(${calculatedTotal.toLocaleString()}원)이 일치하지 않습니다.`,
      );
    } else {
      setAmountError(null);
    }
  }, [totalAmount, calculatedTotal]);

  return (
    <BaseFormModal
      title="구매 요청 승인"
      isOpen={isOpen}
      onClose={onCloseAction}
      onConfirm={() => onConfirmAction(approvalMessage)}
      confirmText="승인하기"
      cancelText="취소"
      confirmButtonProps="w-[158px] h-[54px] md:w-[310px] md:h-[64px]"
      cancelButtonProps="w-[158px] h-[54px] md:w-[310px] md:h-[64px]"
      confirmDisabled={!isValid || isOverBudget || !!amountError}
      smallSize="w-[375px] h-auto"
      largeSize="md:w-[688px] h-auto"
    >
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>요청인</label>
          <Input
            value={requester}
            readOnly
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] bg-gray-100'
          />
        </div>

        <div className='flex flex-col gap-3'>
          <label className='text-[20px] font-semibold'>요청 품목</label>
          <div className='flex flex-col gap-3 border border-[#FCC49C] rounded-xl p-3 bg-white max-h-[250px] overflow-y-auto'>
            {items.map((item) => (
              <PurchaseItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className='flex justify-between items-center text-[20px] font-semibold border-t border-[#FCC49C] pt-3'>
          <span>총 {items.length}건</span>
          <span className='text-[#F97B22]'>{totalAmount.toLocaleString()}원</span>
        </div>

        <div className='flex justify-between items-center text-[20px] font-semibold'>
          <span>남은 예산 금액</span>
          <span className={`${isOverBudget ? 'text-red-500' : ''}`}>
            {budgetLeft !== undefined ? budgetLeft.toLocaleString() : '0'}원
          </span>
        </div>

        {isOverBudget && (
          <p className='text-red-500 text-sm font-semibold'>구매 금액이 남은 예산을 초과합니다.</p>
        )}

        {amountError && (
          <div className='text-red-500 text-sm font-semibold'>{amountError}</div>
        )}

        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>승인 메시지</label>
          <Textarea
            placeholder='승인 메시지를 입력해주세요.'
            value={approvalMessage}
            {...register('approvalMessage', {
              required: true,
              minLength: 8,
              onChange: (e) => setValue('approvalMessage', e.target.value),
            })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[120px]'
          />
        </div>
      </div>
    </BaseFormModal>
  );
}