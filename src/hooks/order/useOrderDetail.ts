import { useEffect, useState } from 'react';
import { getAllCategories, getOrderDetail } from '@/lib/api/cart';
import { Category } from '@/components/gnb/TabMenu';
import { OrderDetailResponse } from '@/types/cart';
import { showCustomToast } from '@/components/ui/Toast/Toast';

export function useOrderDetail(orderId: string) {
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [orderRes, categoriesRes] = await Promise.all([
          getOrderDetail(orderId),
          getAllCategories(),
        ]);
        setOrder(orderRes);
        setCategories(categoriesRes);
      } catch (e) {
        showCustomToast({
          label: '데이터를 불러오지 못했습니다.',
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  return { order, categories, loading };
}
