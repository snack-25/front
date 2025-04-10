import { useEffect, useState } from 'react';
import { Category } from '@/components/gnb/TabMenu';
import { getOrderRequestDetail, getAllCategories } from '@/lib/api/cart';
import { OrderRequestDetail } from '@/types/cart';
import { showCustomToast } from '@/components/ui/Toast/Toast';

export const useOrderRequestDetail = (orderRequestId: string) => {
  const [data, setData] = useState<OrderRequestDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderData, categoryData] = await Promise.all([
          getOrderRequestDetail(orderRequestId),
          getAllCategories(),
        ]);
        setData(orderData);
        setCategories(categoryData);
      } catch (e) {
        showCustomToast({
          label: '데이터를 불러오지 못했습니다.',
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [orderRequestId]);

  return { data, categories, loading };
};
