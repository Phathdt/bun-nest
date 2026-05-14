import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyRow } from '@/components/empty-row';
import { MutationError } from '@/components/mutation-error';
import { PanelHeader } from '@/components/panel-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { productsApi, type Product, type ProductInput } from '@/lib/api';
import { formatDate, formatMoney } from '@/lib/format';

const emptyProduct: ProductInput = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
};

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.list,
  });
  const saveMutation = useMutation({
    mutationFn: (product: ProductInput) =>
      editingId ? productsApi.update(editingId, product) : productsApi.create(product),
    onSuccess: async () => {
      setForm(emptyProduct);
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: productsApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const products = productsQuery.data ?? [];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveMutation.mutate({
      ...form,
      description: form.description?.trim() || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  }

  function edit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock,
    });
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[390px_1fr]">
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-950">
              {editingId ? 'Update product' : 'Create product'}
            </h2>
            <p className="text-sm text-stone-500">Name, price, and stock are required.</p>
          </div>
          {editingId ? (
            <Button
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setForm(emptyProduct);
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>
        <form className="grid gap-3" onSubmit={submit}>
          <Field label="Name">
            <Input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Keyboard"
              required
            />
          </Field>
          <Field label="Description">
            <Input
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Optional"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price">
              <Input
                min="0"
                step="0.01"
                type="number"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: Number(event.target.value) })
                }
                required
              />
            </Field>
            <Field label="Stock">
              <Input
                min="0"
                step="1"
                type="number"
                value={form.stock}
                onChange={(event) =>
                  setForm({ ...form, stock: Number(event.target.value) })
                }
                required
              />
            </Field>
          </div>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {editingId ? 'Save changes' : 'Create product'}
          </Button>
          <MutationError error={saveMutation.error} />
        </form>
      </Card>

      <Card className="overflow-hidden">
        <PanelHeader
          title="Inventory"
          count={products.length}
          isLoading={productsQuery.isFetching}
          onRefresh={() => productsQuery.refetch()}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-y border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-stone-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-950">{product.name}</div>
                    <div className="text-xs text-stone-500">
                      {product.description || product.id}
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatMoney(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">{formatDate(product.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => edit(product)}>
                        <Pencil className="size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(product.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length ? <EmptyRow colSpan={5} label="No products yet" /> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
