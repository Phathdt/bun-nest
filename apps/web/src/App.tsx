import { Boxes, ClipboardList, PackagePlus } from 'lucide-react';
import type { AnchorHTMLAttributes } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router';
import { OrdersPage } from '@/pages/orders/orders-page';
import { ProductsPage } from '@/pages/products/products-page';
import { cn } from '@/lib/utils';

function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d6d3d1_0,#f5f3ef_34%,#ebe8e1_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-stone-300 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-3 py-1 text-xs font-medium text-stone-600">
              <Boxes className="size-3.5" />
              Bun Nest operations
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">
              Products and orders
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Manage inventory records and create priced orders against the Nest API.
            </p>
          </div>
          <nav className="inline-flex w-full rounded-lg border border-stone-300 bg-white p-1 md:w-auto">
            <NavButton to="/products">
              <PackagePlus className="size-4" />
              Products
            </NavButton>
            <NavButton to="/orders">
              <ClipboardList className="size-4" />
              Orders
            </NavButton>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </div>
    </main>
  );
}

function NavButton({
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition md:flex-none',
          isActive ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-100',
          className,
        )
      }
      {...props}
    />
  );
}

export default App;
