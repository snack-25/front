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

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: {
    id: string;
    name: string;
    category: string;
    subCategory: string;
    price: number;
    imageUrl: string;
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
    getValues,
    watch,
    control,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price.toString(), // 🔄 문자열로 초기화
      imageUrl: null as File | null,
      link: product.link,
    },
    mode: 'onChange',
  });

  const [previewImage, setPreviewImage] = useState<string>(product.imageUrl);

  useEffect(() => {
    setPreviewImage(product.imageUrl);
    reset({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price.toString(),
      imageUrl: null,
      link: product.link,
    });
  }, [product, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setValue('imageUrl', file);
    }
  };

  return (
    <BaseFormModal
      title='상품 수정'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(() => {
        const values = getValues();
        console.log('🧾 getValues()', values);

        const imageUrlToSend = previewImage;

        onUpdate({
          id: product.id,
          name: values.name,
          category: values.category,
          subCategory: values.subCategory,
          price: Number(values.price), // ✅ 수동 변환
          imageUrl: imageUrlToSend,
          link: values.link,
        });
      })}
      confirmText='수정하기'
      cancelText='취소'
      confirmDisabled={!isValid}
      smallSize='w-[375px] h-[770px]'
      largeSize='md:w-[688px] md:h-[1122px]'
      confirmButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      cancelButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
    >
      <div className='flex flex-col gap-5 md:gap-16 w-[327px] md:w-[640px]'>
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>상품명</label>
          <Input
            {...register('name', { required: true })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>

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
                    setValue('subCategory', '');
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

        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>가격</label>
          <Input
            type='number'
            {...register('price', { required: true })} // valueAsNumber 제거
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>

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
              imageSrc={previewImage}
              smallSize='w-[100px] h-[100px]'
              largeSize='md:w-[160px] md:h-[160px]'
              altText='상품 기본 이미지'
            />
          </label>
        </div>

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
