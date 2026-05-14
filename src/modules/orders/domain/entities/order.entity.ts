export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Order = {
  id: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
};
