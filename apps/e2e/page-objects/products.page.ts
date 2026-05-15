import { TimeoutValue } from '@config/test.config';
import { getAppUrl, URLS } from '@config/urls.config';
import { expect, type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(getAppUrl(URLS.ROUTES.PRODUCTS), {
      waitUntil: 'domcontentloaded',
      timeout: TimeoutValue.NAVIGATION,
    });
    await expect(this.page.getByRole('heading', { name: 'Create product' })).toBeVisible();
  }

  async createProduct(input: {
    name: string;
    description?: string;
    price: number;
    stock: number;
  }): Promise<void> {
    await this.fillProductForm(input);
    await this.page.getByRole('button', { name: /^Create product$/ }).click();
    await this.expectProductVisible(input.name);
  }

  async editProduct(
    currentName: string,
    input: {
      name: string;
      description?: string;
      price: number;
      stock: number;
    },
  ): Promise<void> {
    await this.productRow(currentName).getByRole('button', { name: /edit/i }).click();
    await expect(this.page.getByRole('heading', { name: 'Update product' })).toBeVisible();
    await this.fillProductForm(input);
    await this.page.getByRole('button', { name: /^Save changes$/ }).click();
    await this.expectProductVisible(input.name);
  }

  async deleteProduct(name: string): Promise<void> {
    await this.productRow(name).getByRole('button', { name: /delete/i }).click();
    await this.expectProductRemoved(name);
  }

  async expectProductRemoved(name: string): Promise<void> {
    await expect(this.page.getByRole('row').filter({ hasText: name })).toHaveCount(0, {
      timeout: TimeoutValue.EXPECT,
    });
  }

  async expectProductVisible(name: string): Promise<void> {
    await expect(this.productRow(name)).toBeVisible({ timeout: TimeoutValue.EXPECT });
  }

  async expectProductPrice(name: string, formattedPrice: string): Promise<void> {
    await expect(this.productRow(name)).toContainText(formattedPrice, {
      timeout: TimeoutValue.EXPECT,
    });
  }

  private async fillProductForm(input: {
    name: string;
    description?: string;
    price: number;
    stock: number;
  }): Promise<void> {
    await this.page.getByLabel('Name').fill(input.name);
    await this.page.getByLabel('Description').fill(input.description ?? '');
    await this.page.getByLabel('Price').fill(String(input.price));
    await this.page.getByLabel('Stock').fill(String(input.stock));
  }

  private productRow(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name }).first();
  }
}
