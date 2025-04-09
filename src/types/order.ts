// src/types/order.ts
export interface OrderItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  price: number;
  status: string;
  items: OrderItem[];
}
