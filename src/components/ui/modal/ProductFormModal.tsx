import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

// 카테고리 데이터
const mainCategories = [
  '스낵',
  '음료',
  '생수',
  '간편식',
  '신선식품',
  '원두커피',
  '비품',
];
const subCategories: Record<string, string[]> = {
  스낵: ['과자', '쿠키', '초콜릿류', '젤리류'],
  음료: ['탄산음료', '과즙음료', '커피'],
  생수: ['생수', '스파클링'],
  간편식: ['컵라면', '핫도그', '계란'],
  신선식품: ['샐러드', '도시락'],
  원두커피: ['드립커피', '원두'],
  비품: ['생활용품', '일회용품'],
};

// 상품 등록 모달 Props 타입 정의
interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    category: string;
    subCategory: string;
    price: number;
    image: File | null;
    link: string;
  }) => void;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onConfirm,
}: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      name: '',
      category: '대분류',
      subCategory: '소분류',
      price: 0,
      image: null as File | null, // 파일 업로드 기본값
      link: '',
    },
    mode: 'onChange', // 값이 변경될 때마다 폼 검증 실행
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(''); // 선택된 대분류 카테고리 상태
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null); // 이미지 URL 상태

  // 파일 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이전 URL 메모리에서 해제
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setValue('image', file);
      setPreviewImage(newUrl); // 이미지 미리보기
      setObjectUrl(newUrl);
    }
  };

  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 URL 해제
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return (
    <BaseFormModal
      title='상품 등록'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onConfirm)} // form 제출 시 실행
      confirmText='등록하기'
      cancelText='취소'
      confirmDisabled={!isValid}
      smallSize='w-[375px] h-[770px]'
      largeSize='md:w-[688px] md:h-[1048px]'
      confirmButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      cancelButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
    >
      {/* 입력 필드 컨테이너 */}
      <div className='flex flex-col gap-5 md:gap-12 w-[327px] md:w-[640px]'>
        {/* 상품명 입력 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>상품명</label>
          <Input
            placeholder='상품명을 입력해주세요.'
            {...register('name', { required: true })} // React Hook Form과 연결
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>

        {/* 카테고리 선택 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>카테고리</label>
          <div className='flex gap-2'>
            {/* 대분류 선택 */}
            <Controller
              control={control} // React Hook Form 컨트롤러 사용
              name='category'
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    setSelectedCategory(value || '대분류'); // 대분류 선택 시 상태 업데이트
                    setValue('category', value || '대분류'); // React Hook Form 값 설정
                  }}
                >
                  <SelectTrigger className='w-full h-[54px] md:h-[64px] border border-[#FCC49C] px-4 rounded-xl'>
                    <SelectValue placeholder='대분류' />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {/* 소분류 선택 */}
            <Controller
              control={control}
              name='subCategory'
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    setValue('subCategory', value || '소분류')
                  }
                >
                  <SelectTrigger className='w-full h-[54px] md:h-[64px] border border-[#FCC49C] px-4 rounded-xl'>
                    <SelectValue placeholder='소분류' />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory && subCategories[selectedCategory] ? (
                      subCategories[selectedCategory].map((sub) => (
                        <SelectItem
                          key={sub}
                          value={sub}
                        >
                          {sub}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value='소분류'
                        disabled
                      >
                        대분류를 먼저 선택해주세요
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        {/* 가격 입력 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>가격</label>
          <Input
            type='number'
            placeholder='가격을 입력해주세요.'
            {...register('price', { required: true, valueAsNumber: true })}
            onChange={(e) =>
              setValue('price', Math.max(0, Number(e.target.value)))
            }
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>

        {/* 상품 이미지 업로드 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>상품 이미지</label>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            id='imageUpload'
            onChange={handleImageUpload}
          />
          <label
            htmlFor='imageUpload'
            className='cursor-pointer'
          >
            <ResponsiveImage
              imageSrc={
                previewImage || '/img/input/profile/upload-default-md.svg'
              }
              smallSize='w-[100px] h-[100px]'
              largeSize='md:w-[160px] md:h-[160px]'
              altText='상품 기본 이미지'
            />
          </label>
        </div>

        {/* 제품 링크 입력 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>제품 링크</label>
          <Input
            type='url'
            placeholder='링크를 입력해주세요.'
            {...register('link', { required: true })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>
      </div>
    </BaseFormModal>
  );
}
