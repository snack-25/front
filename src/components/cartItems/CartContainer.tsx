import React from 'react';
import CartItemList from './CartItemList';
import CartActions from './CartActions';
import { CartResponse } from '@/types/cart';
import CartHeader from './CartHeader';

type CartContainerProps = {
  cartData: CartResponse;
  selectedIds: string[];
  selectAll: boolean;
  handleSelectAll: () => void;
  toggleSelect: (itemId: string) => void;
  handleDeleteItem: (itemId: string) => void;
  handleDelete: () => void;
  handleDeleteAll: () => void;
  fetchCart: () => void;
};

export default function CartContainer({
  cartData,
  selectedIds,
  selectAll,
  handleSelectAll,
  toggleSelect,
  handleDeleteItem,
  handleDelete,
  handleDeleteAll,
  fetchCart,
}: CartContainerProps) {
  return (
    <div className='w-full lg:w-[1254px] bg-[#FBF8F4] border border-[#FFFDF9] flex flex-col'>
      <CartHeader
        selectAll={selectAll}
        handleSelectAll={handleSelectAll}
      />
      <CartItemList
        cartData={cartData}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        handleDeleteItem={handleDeleteItem}
        fetchCart={fetchCart}
      />
      <CartActions
        handleDelete={handleDelete}
        handleDeleteAll={handleDeleteAll}
      />
    </div>
  );
}
