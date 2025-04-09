import { useCallback, useEffect, useState } from 'react';
import {
  getCartItems,
  deleteCartItems,
  getSelectedCartSummary,
} from '@/lib/api/cart';
import {
  CartResponse,
  GetCartSummaryResponse,
  CreateOrderRequestItem,
} from '@/types/cart';
import { showCustomToast } from '@/components/ui/Toast/Toast';

export const useCart = (cartId: string) => {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSummary, setSelectedSummary] =
    useState<GetCartSummaryResponse | null>(null);

  const fetchCart = useCallback(async () => {
    const data = await getCartItems(cartId);
    setCartData(data);
    try {
      const data = await getCartItems(cartId);
      setCartData(data);
    } catch (e) {
      showCustomToast({
        label: '장바구니 데이터를 불러오지 못했습니다.',
        variant: 'error',
      });
    }
  }, [cartId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!cartData || selectedIds.length === 0) {
        setSelectedSummary(null);
        return;
      }

      const selectedItems = cartData.items
        .filter((item) => selectedIds.includes(item.id))
        .map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

      try {
        const summary = await getSelectedCartSummary(cartId, selectedItems);
        setSelectedSummary(summary);
      } catch (e) {
        showCustomToast({
          label: '요약 정보를 불러오지 못했습니다.',
          variant: 'error',
        });
      }
    };

    fetchSummary();
  }, [selectedIds, cartData, cartId]);

  const toggleSelect = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allIds = cartData?.items.map((item) => item.id) || [];
      setSelectedIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const allIds = cartData?.items.map((item) => item.id) || [];
    setSelectAll(selectedIds.length === allIds.length && allIds.length > 0);
  }, [selectedIds, cartData]);

  const handleDelete = async () => {
    try {
      await deleteCartItems(cartId, selectedIds);
      setSelectedIds([]);
      fetchCart();
    } catch (e) {
      console.error('선택 항목 삭제 실패:', e);
      showCustomToast({
        label: '선택 항목 삭제에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteCartItems(cartId, [itemId]);
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
      fetchCart();
    } catch (e) {
      console.error('항목 삭제 실패:', e);
      showCustomToast({
        label: '해당 항목 삭제에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  const handleDeleteAll = async () => {
    const allIds = cartData?.items.map((item) => item.id) || [];
    try {
      await deleteCartItems(cartId, allIds);
      setSelectedIds([]);
      fetchCart();
    } catch (e) {
      console.error('전체 삭제 실패:', e);
      showCustomToast({
        label: '전체 항목 삭제에 실패했습니다.',
        variant: 'error',
      });
    }
  };

  return {
    cartData,
    selectedIds,
    selectAll,
    selectedSummary,
    toggleSelect,
    handleSelectAll,
    handleDelete,
    handleDeleteItem,
    handleDeleteAll,
    fetchCart,
  };
};
