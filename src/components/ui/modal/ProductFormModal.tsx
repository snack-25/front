'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import CategorySelect from '@/components/ui/CategorySelect';
import { Input } from '@/components/ui/Input';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { showCustomToast } from '@/components/ui/Toast/Toast';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  category: string; // 대분류 (한글)
  subCategory: string; // 소분류 (id)
  price: number;
  image: File | null;
  link: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
}: ProductFormModalProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      category: '',
      subCategory: '',
      price: 0,
      image: null,
      link: '',
    },
    mode: 'onChange',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    const newUrl = URL.createObjectURL(file);
    setValue('image', file);
    setPreviewImage(newUrl);
    setObjectUrl(newUrl);
  };

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const onConfirm = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description', '테스트 설명');
      formData.append('categoryId', data.subCategory);
      formData.append('price', data.price.toString());

      if (data.image) {
        formData.append('imageUrl', data.image);
      } else {
        formData.append('imageUrl', '');
      }

      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('응답값:', res);
      }

      if (!res.ok) {
        showCustomToast({
          label: '상품 등록에 실패하였습니다!',
          variant: 'error',
        });
      }

      showCustomToast({
        label: '상품 등록에 성공하였습니다!',
        variant: 'success',
      });
      onClose();
      router.refresh();
    } catch (err) {
      console.error(err);
      showCustomToast({
        label: '상품 등록 중 오류가 발생하였습니다.',
        variant: 'error',
      });
    }
  };

  return (
    <BaseFormModal
      title='상품 등록'
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onConfirm)}
      confirmText='등록하기'
      cancelText='취소'
      confirmDisabled={!isValid}
      smallSize='w-[375px] h-[770px]'
      largeSize='md:w-[688px] md:h-[1048px]'
      confirmButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
      cancelButtonProps='w-[158px] h-[54px] md:w-[310px] md:h-[64px]'
    >
      <div className='flex flex-col gap-5 md:gap-12 w-[327px] md:w-[640px]'>
        {/* 상품명 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>상품명</label>
          <Input
            placeholder='상품명을 입력해주세요.'
            {...register('name', { required: true })}
            className='text-[16px] border border-[#FCC49C] px-4 rounded-xl h-[54px] md:h-[64px]'
          />
        </div>

        {/* 카테고리 선택 */}
        <div className='flex flex-col gap-2'>
          <label className='text-[20px] font-semibold'>카테고리</label>
          <CategorySelect
            onCategoryChange={(catName) => setValue('category', catName)}
            onSubCategoryChange={(subId) => setValue('subCategory', subId)}
          />
        </div>

        {/* 가격 */}
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

        {/* 이미지 업로드 */}
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

        {/* 링크 입력 */}
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
