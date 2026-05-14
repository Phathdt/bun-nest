import { z } from 'zod';

export const orderItemInputSchema = z.object({
  productId: z.uuid(),
  quantity: z.coerce.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
