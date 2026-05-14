import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const productInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
});

export const createProductSchema = productInputSchema.extend({
  stock: productInputSchema.shape.stock.default(0),
});

export const updateProductSchema = productInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one field is required' },
);

export type Product = z.infer<typeof productSchema>;
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
