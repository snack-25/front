// types/cart.ts
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
}

export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  estimatedRemainingBudget: number;
}

export interface DeleteCartItemsResponse {
  success: boolean;
  message?: string;
}

interface CartSummaryProps {
  cartData: {
    totalAmount: number;
    shippingFee: number;
    estimatedRemainingBudget: number;
    items: { id: string }[];
  };
  onOrder: () => void;
}
