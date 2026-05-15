import { Given, Then, When } from '@cucumber/cucumber';
import { ProductsPage } from '@page-objects/products.page';
import type { BrowserWorld } from '@support/world';

type ProductData = {
  name: string;
  updatedName: string;
  description: string;
  updatedDescription: string;
  price: number;
  updatedPrice: number;
  stock: number;
  updatedStock: number;
};

function productData(world: BrowserWorld): ProductData {
  const existing = world.data.product as ProductData | undefined;
  if (existing) {
    return existing;
  }

  const suffix = Date.now();
  const data: ProductData = {
    name: `E2E Keyboard ${suffix}`,
    updatedName: `E2E Keyboard Pro ${suffix}`,
    description: 'Created by cucumber',
    updatedDescription: 'Updated by cucumber',
    price: 49.99,
    updatedPrice: 79.5,
    stock: 12,
    updatedStock: 7,
  };
  world.data.product = data;
  return data;
}

Given('I am on the products page', async function (this: BrowserWorld) {
  await new ProductsPage(this.page).navigate();
});

When('I create a unique product', async function (this: BrowserWorld) {
  const data = productData(this);
  await new ProductsPage(this.page).createProduct({
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
  });
});

Then('I should see the product in inventory', async function (this: BrowserWorld) {
  const data = productData(this);
  await new ProductsPage(this.page).expectProductVisible(data.name);
});

When('I update that product', async function (this: BrowserWorld) {
  const data = productData(this);
  await new ProductsPage(this.page).editProduct(data.name, {
    name: data.updatedName,
    description: data.updatedDescription,
    price: data.updatedPrice,
    stock: data.updatedStock,
  });
});

Then('I should see the updated product in inventory', async function (this: BrowserWorld) {
  const data = productData(this);
  const page = new ProductsPage(this.page);
  await page.expectProductVisible(data.updatedName);
  await page.expectProductPrice(data.updatedName, '$79.50');
});

When('I delete that product', async function (this: BrowserWorld) {
  const data = productData(this);
  await new ProductsPage(this.page).deleteProduct(data.updatedName);
});

Then('the product should be removed from inventory', async function (this: BrowserWorld) {
  const data = productData(this);
  await new ProductsPage(this.page).expectProductRemoved(data.updatedName);
});
