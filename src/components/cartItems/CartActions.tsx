import { CartActionsProps } from '@/types/cart';

const CartActions = ({ handleDelete, handleDeleteAll }: CartActionsProps) => {
  return (
    <div className='flex justify-between px-4 lg:px-6 py-4 bg-[#F9F6F1] text-sm text-gray-600 border-t'>
      <div className='w-full lg:w-[310px] flex justify-between gap-2'>
        <button
          className='w-1/2 h-[50px] px-[18px] py-[12px] rounded-full border border-[#E0E0E0] text-[#1F1F1F] cursor-pointer'
          onClick={handleDeleteAll}
        >
          전체 상품 삭제
        </button>
        <button
          className='w-1/2 h-[50px] px-[18px] py-[12px] rounded-full border border-[#E0E0E0] text-[#1F1F1F] cursor-pointer'
          onClick={handleDelete}
        >
          선택 상품 삭제
        </button>
      </div>
    </div>
  );
};

export default CartActions;
