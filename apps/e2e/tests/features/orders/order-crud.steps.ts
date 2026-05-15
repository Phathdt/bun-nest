import { Given, Then, When } from '@cucumber/cucumber';
import { OrdersPage } from '@page-objects/orders.page';
import { ProductsPage } from '@page-objects/products.page';
import { expect } from '@playwright/test';
import type { BrowserWorld } from '@support/world';

type OrderData = {
  productName: string;
  price: number;
  quantity: number;
};

function orderData(world: BrowserWorld): OrderData {
  const existing = world.data.order as OrderData | undefined;
  if (existing) {
    return existing;
  }

  const data: OrderData = {
    productName: `E2E Mouse ${Date.now()}`,
    price: 15.25,
    quantity: 3,
  };
  world.data.order = data;
  return data;
}

Given('I have a product available for ordering', async function (this: BrowserWorld) {
  const data = orderData(this);
  const productsPage = new ProductsPage(this.page);

  await productsPage.navigate();
  await productsPage.createProduct({
    name: data.productName,
    description: 'Order fixture product',
    price: data.price,
    stock: 20,
  });
});

When('I create an order for that product', async function (this: BrowserWorld) {
  const data = orderData(this);
  const ordersPage = new OrdersPage(this.page);

  await ordersPage.navigate();
  await ordersPage.createOrder(data.productName, data.quantity);
});

Then('I should see the new order total', async function (this: BrowserWorld) {
  const data = orderData(this);
  await new OrdersPage(this.page).expectLatestOrderTotal(
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(data.price * data.quantity),
  );
});

When('I cancel the latest order', async function (this: BrowserWorld) {
  await new OrdersPage(this.page).cancelLatestOrder();
});

Then('the latest order should be cancelled', async function (this: BrowserWorld) {
  await expect(this.page.locator('tbody tr').first()).toContainText('Cancelled');
});
