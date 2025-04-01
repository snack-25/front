import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useAuthStore } from '@/app/api/auth/useAuthStore';
import { fetchApi } from '@/app/api/instance';
import { IProducts } from '@/app/productList/page';
import { showCustomToast } from '@/components/ui/Toast/Toast';

export default function useCategory() {
  const searchParams = useSearchParams();
  const mainCategory = searchParams.get('parentId') as string;
  const subCategory = searchParams.get('categoryId') as string;

  const [mainName, setMainName] = useState<string>('');
  const [subName, setSubName] = useState<string>('');
  const { isAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuth) {
      showCustomToast({ label: '인증에 실패하였습니다', variant: 'error' });
      return;
    }

    let isMounted = true;

    const fetchName = async () => {
      try {
        const data: IProducts[] = await fetchApi('/categories/all');
        if (!isMounted) {
          return;
        }

        const mainData = data.find((item) => item.id === mainCategory);
        const subData = data.find((item) => item.id === subCategory);

        setMainName(mainData?.name || '상위 카테고리');
        setSubName(subData?.name || '하위 카테고리');
      } catch (e) {
        console.error('카테고리 이름 가져오기 실패:', e);
      }
    };

    fetchName();

    return () => {
      isMounted = false;
    };
  }, [mainCategory, subCategory, isAuth]);

  return { mainName, subName };
}
