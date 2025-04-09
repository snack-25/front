'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { useAuthStore } from '@/app/auth/useAuthStore';
import { Category } from '@/components/gnb/TabMenu';
import { Button } from '@/components/ui/Button';
import { showCustomToast } from '@/components/ui/Toast/Toast';
import { getAllCategories, getOrderRequestDetail } from '@/lib/api/cart';
import { getCategoryNamePair } from '@/lib/utils/getCategoryNamePair';
import { OrderRequestDetail } from '@/types/cart';

export default function OrderRequestCompletePage() {
  const { orderRequestId } = useParams() as { orderRequestId: string };
  const [data, setData] = useState<OrderRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const { user } = useAuthStore();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (e) {
        console.error('카테고리 불러오기 실패:', e);
        showCustomToast({
          label: '카테고리 정보를 불러오지 못했습니다.',
          variant: 'error',
        });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getOrderRequestDetail(orderRequestId);
        setData(res);
      } catch (e) {
        console.error('주문 요청 상세 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [orderRequestId]);

  if (loading) {return <div className='text-center p-10'>로딩 중...</div>;}
  if (!data) {return <div className='text-center p-10'>데이터 없음</div>;}

  const firstItem = data.items[0];
  const totalQuantity = data.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const category = getCategoryNamePair(categories, firstItem.categoryId || '');

  return (
    <div className='min-h-screen bg-[#FBF8F4] flex flex-col items-center px-4'>
      <div className='w-full max-w-xl mx-auto'>
        <div className='text-center mt-[50px]'>
          <h1 className='text-[32px] text-black font-bold mb-1'>
            구매 요청 완료
          </h1>
          <p className='text-[16px] leading-[32px] text-[#ABABAB] font-normal'>
            관리자에게 성공적으로 구매 요청이 완료되었습니다.
          </p>
        </div>

        <p className='text-[24px] font-bold text-[#1F1F1F] mb-4 mt-[70px]'>
          상품정보
        </p>

        <div className='w-full bg-[#FBF8F4] border-y-2 border-[#E6E6E6] px-6 py-6 mb-6'>
          {data.items.length > 0 && (
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
                  <p className='text-sm font-medium text-[#1F1F1F]'>
                    {data.items.length > 1
                      ? `${firstItem.productName} 외 ${data.items.length - 1}개`
                      : firstItem.productName}
                  </p>
                  <p className='text-xs text-gray-400 mt-[2px]'>
                    {category.parentName} · {category.childName}
                  </p>
                </div>
              </div>

              <div className='flex justify-between items-center mt-1'>
                <p className='text-base font-semibold text-[#1F1F1F]'>
                  총 {totalQuantity}개
                </p>
                <p className='text-[18px] font-bold text-[#F97B22]'>
                  {data.totalAmount.toLocaleString()}원
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='w-full bg-[#FBF8F4] border-y-2 border-[#E6E6E6] p-6 mb-6'>
          <p className='text-sm font-semibold text-[#1F1F1F] mb-2'>
            요청 메시지
          </p>
          <textarea
            readOnly
            value={firstItem?.requestMessage || '요청 메시지가 없습니다.'}
            className='w-full h-[100px] p-3 rounded-[16px] border-2 border-[#F1ECE7] text-[#999999] text-[18px] leading-[26px] font-normal resize-none bg-[#FBF8F4]'
          />
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
            onClick={() => router.push('/my-request')}
          >
            요청 내역 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
}
