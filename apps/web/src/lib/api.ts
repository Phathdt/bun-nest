export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  description?: string;
  price: number;
  stock: number;
};

export type CreateOrderInput = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);

  if (!response.ok) {
    const error = await readError(response);
    throw new Error(error);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const productsApi = {
  list: () => apiRequest<Product[]>('/api/products'),
  create: (product: ProductInput) =>
    apiRequest<Product>('/api/products', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(product),
    }),
  update: (id: string, product: Partial<ProductInput>) =>
    apiRequest<Product>(`/api/products/${id}`, {
      method: 'PATCH',
      headers: jsonHeaders,
      body: JSON.stringify(product),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/api/products/${id}`, {
      method: 'DELETE',
    }),
};

export const ordersApi = {
  list: () => apiRequest<Order[]>('/api/orders'),
  create: (order: CreateOrderInput) =>
    apiRequest<Order>('/api/orders', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(order),
    }),
  cancel: (id: string) =>
    apiRequest<Order>(`/api/orders/${id}/cancel`, {
      method: 'PATCH',
    }),
};

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}
