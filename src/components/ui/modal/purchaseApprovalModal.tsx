'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
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
  budgetLeft: number; 
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
  const isOverBudget =
    typeof budgetLeft === 'number' && calculatedTotal > budgetLeft; // 예산 초과 여부

  useEffect(() => {
    if (totalAmount !== calculatedTotal) {
      setAmountError(`총 금액이 ${totalAmount.toLocaleString()}원과 다릅니다.`);
    } else {
      setAmountError(null);
    }
  }, [totalAmount, calculatedTotal]);

  return (
    <BaseFormModal
      title='구매 요청 승인'
      isOpen={isOpen}
      onClose={onCloseAction}
      onConfirm={() => onConfirmAction(approvalMessage)}
      confirmText='승인하기'
      cancelText='취소'
      confirmButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      cancelButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      confirmDisabled={
        !isValid || isOverBudget || totalAmount !== calculatedTotal
      }
      smallSize='w-[375px] h-auto'
      largeSize='md:w-[688px] h-auto'
    >
      <div className='flex flex-col gap-5'>
        {/* 요청인 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>요청인</label>
          <Input
            value={requester}
            readOnly
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] bg-gray-100'
          />
        </div>

        {/* 요청 품목 */}
        <div className="flex flex-col gap-3">
          <label className="text-[20px] font-semibold">요청 품목</label>
          <div className="flex flex-col gap-3 border border-[#FCC49C] rounded-xl p-3 bg-white max-h-[250px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border rounded-lg p-4 mb-2">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-md"
                  />
                  <div>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm">수량: {item.quantity}개</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>{item.price.toLocaleString()}원</p>
                  <p className="text-lg font-semibold">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 총 금액 */}
        <div className='flex justify-between items-center text-[20px] font-semibold border-t border-[#FCC49C] pt-3'>
          <span>총 {items.length}건</span>
          <span className='text-[#F97B22]'>
            {calculatedTotal.toLocaleString()}원
          </span>
        </div>

        {/* 남은 예산 금액 */}
        <div className='flex justify-between items-center text-[20px] font-semibold'>
          <span>남은 예산 금액</span>
          <span className={`${isOverBudget ? 'text-red-500' : ''}`}>
            {budgetLeft !== undefined ? budgetLeft.toLocaleString() : '0'}원
          </span>
        </div>

        {/* 예산 초과 경고 */}
        {(isOverBudget || totalAmount !== calculatedTotal) && (
          <p className='text-red-500 text-sm font-semibold'>
            {isOverBudget
              ? `❌ 남은 예산금액(${budgetLeft?.toLocaleString() ?? '0'}원)이 계산 금액(${calculatedTotal.toLocaleString()}원)보다 부족합니다.`
              : `❌ 총 금액(${totalAmount.toLocaleString()}원)과 계산 금액(${calculatedTotal.toLocaleString()}원)이 일치하지 않습니다.`}
          </p>
        )}

        {/* 승인 메시지 */}
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
