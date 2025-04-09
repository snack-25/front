import { CartItemListProps } from '@/types/cart';
import CartItem from './cartItem';

const CartItemList = ({
  cartData,
  selectedIds,
  toggleSelect,
  handleDeleteItem,
  fetchCart,
}: CartItemListProps) => {
  return (
    <div className='max-h-[720px] overflow-y-auto'>
      {cartData.items.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          productId={item.product.id}
          imageUrl={item.product.imageUrl ?? undefined}
          name={item.product.name}
          price={item.product.price}
          quantity={item.quantity}
          total={item.product.price * item.quantity}
          deliveryFee={cartData.shippingFee}
          deliveryType='택배 배송'
          checked={selectedIds.includes(item.id)}
          onToggle={() => toggleSelect(item.id)}
          onDelete={() => handleDeleteItem(item.id)}
          onQuantityChange={fetchCart}
          categoryId={item.product.categoryId}
        />
      ))}
    </div>
  );
};

export default CartItemList;
