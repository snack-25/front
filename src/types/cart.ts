// types/cart.ts
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  categoryId: string;
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

export interface CartSummaryProps {
  cartData: {
    totalAmount: number;
    shippingFee: number;
    estimatedRemainingBudget: number;
    items: { id: string }[];
  };
  onOrder: () => void;
}

export interface CreateOrderRequestItem {
  productId: string;
  quantity: number;
  productName?: string;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
}
export interface CreateOrderRequestPayload {
  items: {
    productId: string;
    quantity: number;
  }[];
  requestMessage: string;
  requesterId?: string;
  companyId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  categoryId?: string;
  imageUrl?: string;
  total: number;
  deliveryFee: number;
  deliveryType: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onQuantityChange?: () => void;
}

export interface OrderRequestItem {
  productId: string;
  quantity: number;
  productName?: string;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
}
export interface OrderRequestModalProps {
  visible: boolean;
  items: OrderRequestItem[];
  shippingFee?: number;
  onClose: () => void;
  onConfirm: (message: string) => void;
}
