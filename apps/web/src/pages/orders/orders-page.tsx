import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, ShoppingCart, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyRow } from '@/components/empty-row';
import { MutationError } from '@/components/mutation-error';
import { PanelHeader } from '@/components/panel-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, FieldHint } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ordersApi, productsApi, type CreateOrderInput, type Order } from '@/lib/api';
import { formatDate, formatMoney, shortId } from '@/lib/format';

export function OrdersPage() {
  const queryClient = useQueryClient();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.list,
  });
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.list,
  });
  const createMutation = useMutation({
    mutationFn: (order: CreateOrderInput) => ordersApi.create(order),
    onSuccess: async () => {
      setProductId('');
      setQuantity(1);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
  const cancelMutation = useMutation({
    mutationFn: ordersApi.cancel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const products = productsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!productId) {
      return;
    }

    createMutation.mutate({
      items: [{ productId, quantity }],
    });
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[390px_1fr]">
      <Card className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-stone-950">Create order</h2>
          <p className="text-sm text-stone-500">
            Select one product line item to price from inventory.
          </p>
        </div>
        <form className="grid gap-3" onSubmit={submit}>
          <Field label="Product">
            <select
              className="h-9 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-200"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {formatMoney(product.price)}
                </option>
              ))}
            </select>
            <FieldHint>
              {productsQuery.isFetching
                ? 'Loading products...'
                : `${products.length} available`}
            </FieldHint>
          </Field>
          <Field label="Quantity">
            <Input
              min="1"
              step="1"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              required
            />
          </Field>
          <Button type="submit" disabled={createMutation.isPending || !products.length}>
            {createMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            <ShoppingCart className="size-4" />
            Create order
          </Button>
          <MutationError error={createMutation.error} />
        </form>
      </Card>

      <Card className="overflow-hidden">
        <PanelHeader
          title="Orders"
          count={orders.length}
          isLoading={ordersQuery.isFetching}
          onRefresh={() => ordersQuery.refetch()}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-y border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-stone-100 align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-950">{shortId(order.id)}</div>
                    <div className="text-xs text-stone-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="grid gap-1">
                      {order.items.map((item) => (
                        <span key={item.id} className="text-xs text-stone-600">
                          {item.quantity} x {shortId(item.productId)} at{' '}
                          {formatMoney(item.unitPrice)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatMoney(order.total)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge order={order} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button
                        variant="secondary"
                        disabled={
                          order.status === 'cancelled' || cancelMutation.isPending
                        }
                        onClick={() => cancelMutation.mutate(order.id)}
                      >
                        <XCircle className="size-4" />
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!orders.length ? <EmptyRow colSpan={5} label="No orders yet" /> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

function OrderStatusBadge({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700">
        <XCircle className="mr-1 size-3.5" />
        Cancelled
      </Badge>
    );
  }

  return (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
      <CheckCircle2 className="mr-1 size-3.5" />
      {order.status}
    </Badge>
  );
}
