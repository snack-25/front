'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { useAuthStore } from '@/app/auth/useAuthStore';
import EmptyImage from '@/components/productList/EmptyImage';
import Loading from '@/components/productList/Loading';
import ProductMenu from '@/components/productList/ProductMenu';
import { Button } from '@/components/ui/Button';
import ProductDeleteModal from '@/components/ui/modal/ProductDeleteModal';
import ProductEditModal from '@/components/ui/modal/ProductEditModal';
import NumberInput from '@/components/ui/NumberInput';
import { showCustomToast } from '@/components/ui/Toast/Toast';
import useCategory from '@/hooks/product/useCategory';
import { useDetail } from '@/hooks/product/useDetail';
import { addCartItem } from '@/lib/api/cart';

import { IProducts } from '../../ProductList';

interface IFormData {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  imageUrl: string;
  link: string;
}

const infoList = [
  { label: '구매 혜택', value: '5포인트 적립 예정' },
  { label: '배송방법', value: '택배' },
  { label: '배송비', value: '3,000원(50,000원 이상 무료 배송)' },
];

export default function ProductDetail() {
  const { user } = useAuthStore();

  const { id } = useParams();
  const { id: productId } = useParams();

  const searchParams = useSearchParams();
  const mainCategory = searchParams.get('parentId') as string;
  const subCategory = searchParams.get('categoryId') as string;
  const { data, isLoading, setIsLoading, handleUpdate } = useDetail(
    id as string,
  );

  const { mainName, subName } = useCategory();
  const [detail, setDetail] = useState<IProducts | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [formData, setformData] = useState<IFormData | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleEditOpen = () => setIsEditOpen((prev) => !prev);
  const handleDeleteOpen = () => setIsDeleteOpen((prev) => !prev);

  useEffect(() => {
    if (data) {
      setDetail(data);
    }
  }, [data]);

  useEffect(() => {
    if (!detail) {
      return;
    }

    setformData({
      id: detail.id,
      name: detail.name,
      category: mainCategory,
      subCategory: subCategory,
      price: detail.price,
      imageUrl: detail.imageUrl,
      link: 'https://www.codeit.kr/',
    });
    setIsLoading(false);
  }, [detail]);

  if (isLoading || !formData?.id) {
    return <Loading size='L' />;
  }
  if (!detail) {
    return <EmptyImage />;
  }

  const { name, price, categoryId, imageUrl, totalSold } = detail;

  const handleAddToCart = async () => {
    if (!user?.cartId) {
      showCustomToast({
        label: '로그인 후 이용해주세요.',
        variant: 'error',
      });
      return;
    }

    try {
      await addCartItem(user.cartId, productId as string, quantity);
      showCustomToast({
        label: '장바구니에 추가되었습니다!',
        variant: 'success',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        showCustomToast({
          label: error.message,
          variant: 'error',
        });
      } else {
        showCustomToast({
          label: '장바구니 추가에 실패했습니다.',
          variant: 'error',
        });
      }
    }
  };

  return (
    <div className='relative flex flex-col my-12 w-full lt:px-[120px] max-lt:px-6'>
      <div className='flex text-gray-400 items-center text-xl font-medium gap-2 mb-6'>
        <div>홈</div>
        <ChevronRight className='text-gray-300' />
        <div>{mainName}</div>
        <ChevronRight className='text-gray-300' />
        <div className='text-black-400'>{subName}</div>
      </div>

      <div className='relative w-full flex gap-20 max-tb:gap-6 max-tb:flex-col'>
        <div className='relative bg-white w-1/2 max-tb:w-full aspect-square rounded-2xl flex items-center justify-center'>
          <div className='absolute w-1/2 h-1/2 aspect-square'>
            <Image
              src={imageUrl || '/img/gnb/gnb-logo-primary.svg'}
              fill
              sizes='(max-width:745px):100vw, 50vw'
              className='object-contain'
              alt={name || '상품 이미지'}
            />
          </div>
        </div>

        <div className='flex flex-col gap-8 w-1/2 max-tb:w-full'>
          <div className='flex justify-between'>
            <div>
              <p className='lt:text-xl max-lt:text-xs font-medium text-gray-500 mb-2'>
                {subName || '카테고리'}
              </p>
              <h1 className='lt:text-3xl max-lt:text-2xl font-semibold text-black-400 mb-6'>
                {name || '상품명'}
              </h1>
              <p className='bg-illustration-02 lt:text-xl max-lt:text-xs font-semibold mb-6 text-orange-400 text-center py-1 w-[98px] h-[40px] max-lt:w-[62px] max-lt:h-6'>
                {totalSold ?? 1}회 구매
              </p>
              <p className='lt:text-3xl max-lt:text-2xl font-bold text-black-400 mb-6'>
                {price.toLocaleString() ?? 1}원
              </p>
            </div>

            {user?.role !== 'USER' && (
              <div>
                <ProductMenu
                  onEditClick={handleEditOpen}
                  onDeleteClick={handleDeleteOpen}
                />

                <ProductEditModal
                  isOpen={isEditOpen}
                  onClose={handleEditOpen}
                  onUpdate={handleUpdate}
                  product={formData as IFormData}
                />

                <ProductDeleteModal
                  id={detail.id}
                  name={detail.name}
                  isOpen={isDeleteOpen}
                  handleOpen={handleDeleteOpen}
                />
              </div>
            )}
          </div>

          <div className='flex flex-col w-full gap-2 lt:text-xl max-lt:text-md border-y-1 border-gray-200 py-8'>
            {infoList.map(({ label, value }) => (
              <p
                key={label}
                className='flex gap-6'
              >
                <span className='text-black-400 font-medium'>{label}</span>
                <span className='text-black-100 font-medium'>{value}</span>
              </p>
            ))}
          </div>

          <div className='flex w-full gap-6'>
            <NumberInput
              value={quantity}
              onChange={setQuantity}
              className='lt:w-[200px] max-lt:w-[118px]'
            />
            <Button
              variant='outline'
              onClick={handleAddToCart}
              className='border-1 bg-primary-400 text-white w-full cursor-pointer transition-opacity duration-300 hover:opacity-80'
            >
              장바구니 담기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
