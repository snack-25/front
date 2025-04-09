'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { useAuthStore } from '@/app/auth/useAuthStore';
import { Category } from '@/components/gnb/TabMenu';
import { Button } from '@/components/ui/Button';
import { showCustomToast } from '@/components/ui/Toast/Toast';
import { getAllCategories, getOrderDetail } from '@/lib/api/cart';
import { getCategoryNamePair } from '@/lib/utils/getCategoryNamePair';
import { OrderDetailResponse } from '@/types/cart';

export default function OrderDetailPage() {
  const { orderId } = useParams() as { orderId: string };
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, categoriesRes] = await Promise.all([
          getOrderDetail(orderId),
          getAllCategories(),
        ]);
        setOrder(orderRes);
        setCategories(categoriesRes);
      } catch (err) {
        console.error('주문 상세 조회 실패', err);
        showCustomToast({
          label: '주문 정보를 불러오지 못했습니다.',
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  if (loading) {return <div className='text-center p-10'>로딩 중...</div>;}
  if (!order)
    {return (
      <div className='text-center p-10'>주문 정보를 불러오지 못했습니다.</div>
    );}

  const firstItem = order.orderItems?.[0];
  const totalQuantity =
    order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const category = getCategoryNamePair(categories, firstItem?.categoryId || '');

  return (
    <div className='min-h-screen bg-[#FBF8F4] flex flex-col items-center px-4'>
      <div className='w-full max-w-xl mx-auto'>
        <div className='text-center mt-[50px]'>
          <h1 className='text-[32px] text-black font-bold mb-1'>구매 완료</h1>
          <p className='text-[16px] leading-[32px] text-[#ABABAB] font-normal'>
            성공적으로 구매가 완료되었습니다.
          </p>
        </div>

        <p className='text-[24px] font-bold text-[#1F1F1F] mb-4 mt-[70px]'>
          상품정보
        </p>

        <div className='w-full bg-[#FBF8F4] border-y-2 border-[#E6E6E6] px-6 py-6 mb-6'>
          {firstItem && (
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <div className='w-[120px] h-[120px] flex justify-center items-center border border-[#E6E6E6] rounded-[16px]'>
                  <Image
                    src={firstItem.imageUrl || '/img/card/item-coke-zero.png'}
                    alt='상품 이미지'
                    width={47}
                    height={81}
                    className='rounded-md border'
                  />
                </div>
                <div className='ml-3'>
                  <p className='font-medium text-[18px] text-[#1F1F1F]'>
                    {order.orderItems.length > 1
                      ? `${firstItem.productName} 외 ${order.orderItems.length - 1}개`
                      : firstItem.productName}
                  </p>
                  <p className='text-[14px] text-gray-500 mt-[2px]'>
                    {category.parentName} · {category.childName}
                  </p>
                </div>
              </div>

              <div className='flex justify-between items-center mt-1'>
                <p className='text-base font-semibold text-[#1F1F1F]'>
                  총 {totalQuantity}개
                </p>
                <p className='text-[18px] font-bold text-[#F97B22]'>
                  {order.totalAmount.toLocaleString()}원
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='flex gap-4 w-full'>
          <Button
            filled='light'
            width='100%'
            onClick={() => router.push(`/cart/${user?.cartId}`)}
          >
            장바구니로 돌아가기
          </Button>
          <Button
            filled='orange'
            width='100%'
            onClick={() => router.push('/history')}
          >
            주문 내역 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
}
