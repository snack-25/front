// types/cart.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  estimatedRemainingBudget: number;
}
