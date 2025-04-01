import { fetchApi } from '@/app/api/instance';
import { IProducts } from '@/app/productList/page';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function useCategory() {
  const searchParams = useSearchParams();
  const mainCategory = searchParams.get('parentId') as string;
  const subCategory = searchParams.get('categoryId') as string;

  const [mainName, setMainName] = useState<string>('');
  const [subName, setSubName] = useState<string>('');

  const fetchName = async () => {
    const data: IProducts[] = await fetchApi('/categories/all');
    const mainData = data.find((item) => item.id === mainCategory);
    const subData = data.find((item) => item.id === subCategory);
    setMainName(mainData?.name || '상위 카테고리');
    setSubName(subData?.name || '하위 카테고리');
  };
  fetchName();
  return { mainName, subName };
}
