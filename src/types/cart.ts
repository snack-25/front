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
  originalBudget: number;
}

export interface DeleteCartItemsResponse {
  success: boolean;
  message?: string;
}

export interface CartSummaryProps {
  cartData: CartResponse;
  summary: GetCartSummaryResponse | null;
  onOrder: () => void;
  selectedIds: string[];
}

export interface CreateOrderRequestItem {
  productId: string;
  quantity: number;
  requestMessage?: string;
  productName?: string;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
}

export interface CreateOrderRequestPayload {
  items: CreateOrderRequestItem[];
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
  categoryId: string;
  imageUrl?: string;
  total: number;
  deliveryFee: number;
  deliveryType: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onQuantityChange?: () => void;
}

export type OrderRequestItem = CreateOrderRequestItem;
export interface OrderRequestModalProps {
  visible: boolean;
  items: OrderRequestItem[];
  shippingFee?: number;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

export interface GetCartSummaryResponse {
  totalAmount: number;
  shippingFee: number;
  estimatedRemainingBudget: number;
  originalBudget: number;
}

export interface OrderRequestDetail {
  requesterId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  resolvedAt: string | null;
  resolverMessage: string | null;
  requesterName: string;
  resolverName: string | null;
  totalAmount: number;
  items: {
    productName: string;
    categoryId: string | null;
    categoryName: string;
    imageUrl: string | null;
    quantity: number;
    price: number;
    requestMessage: string | null;
  }[];
}

export interface OrderDetailItem {
  productId: string;
  productName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  categoryId: string | null;
  categoryName: string | null;
}

export interface OrderDetailResponse {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingMethod: string;
  adminNotes: string | null;
  notes: string | null;
  companyId: string;
  createdById: string;
  updatedById: string;
  requestedById: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
  shippedAt: string | null;
  trackingNumber: string | null;

  orderItems: OrderDetailItem[];
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
  price?: number;
  productName?: string;
}
