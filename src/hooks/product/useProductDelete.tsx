import { useRouter } from 'next/navigation';

import { showCustomToast } from '@/components/ui/Toast/Toast';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:4000';

export default function useProductDelete() {
  const router = useRouter();

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error();
      }

      showCustomToast({ label: '상품이 삭제되었습니다.', variant: 'success' });
      router.replace(`/productList?parentId=cat-스낵&categoryId=sub-과자`);
    } catch (err) {
      showCustomToast({
        label: '상품 삭제에 실패하였습니다.',
        variant: 'error',
      });
    }
  };
  return { deleteProduct };
}
