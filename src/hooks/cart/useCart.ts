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

export const useCart = (cartId: string) => {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSummary, setSelectedSummary] =
    useState<GetCartSummaryResponse | null>(null);

  const fetchCart = useCallback(async () => {
    const data = await getCartItems(cartId);
    setCartData(data);
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

      const summary = await getSelectedCartSummary(cartId, selectedItems);
      setSelectedSummary(summary);
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
    await deleteCartItems(cartId, selectedIds);
    setSelectedIds([]);
    fetchCart();
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteCartItems(cartId, [itemId]);
    setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    fetchCart();
  };

  const handleDeleteAll = async () => {
    const allIds = cartData?.items.map((item) => item.id) || [];
    await deleteCartItems(cartId, allIds);
    setSelectedIds([]);
    fetchCart();
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
