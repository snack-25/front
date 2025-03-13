import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

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

// 상품 수정 모달 Props 타입 정의
interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: {
    id: string;
    name: string;
    category: string;
    subCategory: string;
    price: number;
    image: File | null;
    link: string;
  }) => void;
  product: {
    id: string;
    name: string;
    category: string;
    subCategory: string;
    price: number;
    imageUrl: string;
    link: string;
  };
}

export default function ProductEditModal({
  isOpen,
  onClose,
  onUpdate,
  product,
}: ProductEditModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      image: null as File | null,
      link: product.link,
    },
    mode: 'onChange',
  });

  // 상품 등록 모달과 다른점
  // 상품 수정 모달은 기존 데이터가 이미 채워져 있어야 함.
  // 재사용 가능하도록 ProductFormModal을 확장할 필요가 있을까?

  // 수정할 이미지를 미리 불러옴.
  const [previewImage, setPreviewImage] = useState<string>(product.imageUrl);

  useEffect(() => {
    console.log('Product image updated:', product.imageUrl);
    setPreviewImage(product.imageUrl); // 상품 데이터가 변경되면 미리보기 업데이트
  }, [product.imageUrl]);

  // 파일 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 미리보기용 URL 생성
      setPreviewImage(imageUrl); // UI 업데이트 (미리보기 이미지 변경)
      setValue('image', file); // form 상태 업데이트 (이미지 파일 저장)
    }
  };

  return (
    <BaseFormModal
      title='상품 수정'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit((data) => onUpdate({ ...data, id: product.id }))}
      confirmText='수정하기'
      cancelText='취소'
      confirmDisabled={!isValid}
      smallSize='w-[375px] h-[770px]'
      largeSize='md:w-[688px] md:h-[1122px]'
      confirmButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      cancelButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
    >
      <div className='flex flex-col gap-5 md:gap-16 w-[327px] md:w-[640px]'>
        {/* 상품명 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>상품명</label>
          <Input
            {...register('name', { required: true })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>

        {/* 카테고리 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>카테고리</label>
          <div className='flex gap-2'>
            <Controller
              control={control}
              name='category'
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    setValue('category', value);
                    setValue('subCategory', ''); // 대분류 변경 시 소분류 초기화
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
            <Controller
              control={control}
              name='subCategory'
              render={({ field }) => (
                <Select
                  onValueChange={(value) => setValue('subCategory', value)}
                >
                  <SelectTrigger className='w-full h-[54px] md:h-[64px] border border-[#FCC49C] px-4 rounded-xl'>
                    <SelectValue placeholder='소분류' />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories[watch('category')]?.map((sub) => (
                      <SelectItem
                        key={sub}
                        value={sub}
                      >
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* 가격 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>가격</label>
          <Input
            type='number'
            {...register('price', { required: true, valueAsNumber: true })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>

        {/* 이미지 업로드 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>상품 이미지</label>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            id='imageUpload'
            onChange={handleImageUpload} // 업로드시 이벤트 핸들러 실행
          />
          <label
            htmlFor='imageUpload'
            className='cursor-pointer'
          >
            <ResponsiveImage
              imageSrc={previewImage}
              smallSize='w-[100px] h-[100px]'
              largeSize='md:w-[160px] md:h-[160px]'
              altText='상품 기본 이미지'
            />
          </label>
        </div>

        {/* 제품 링크 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>제품 링크</label>
          <Input
            type='url'
            {...register('link', { required: true })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>
      </div>
    </BaseFormModal>
  );
}
