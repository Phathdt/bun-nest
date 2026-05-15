import { TimeoutValue } from '@config/test.config';
import { getAppUrl, URLS } from '@config/urls.config';
import { expect, type Locator, type Page } from '@playwright/test';

export class OrdersPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(getAppUrl(URLS.ROUTES.ORDERS), {
      waitUntil: 'domcontentloaded',
      timeout: TimeoutValue.NAVIGATION,
    });
    await expect(this.page.getByRole('heading', { name: 'Create order' })).toBeVisible();
  }

  async createOrder(productName: string, quantity: number): Promise<void> {
    const productSelect = this.page.getByLabel('Product');
    const productValue = await productSelect.evaluate(
      (select, name) => {
        const option = Array.from((select as HTMLSelectElement).options).find((item) =>
          item.textContent?.includes(name),
        );
        return option?.value ?? '';
      },
      productName,
    );

    if (!productValue) {
      throw new Error(`Product option not found: ${productName}`);
    }

    await productSelect.selectOption(productValue);
    await this.page.getByLabel('Quantity').fill(String(quantity));
    await this.page.getByRole('button', { name: /^Create order$/ }).click();
    await expect(this.latestOrderRow()).toContainText('pending', {
      timeout: TimeoutValue.EXPECT,
    });
  }

  async expectLatestOrderTotal(formattedTotal: string): Promise<void> {
    await expect(this.latestOrderRow()).toContainText(formattedTotal, {
      timeout: TimeoutValue.EXPECT,
    });
  }

  async cancelLatestOrder(): Promise<void> {
    await this.latestOrderRow().getByRole('button', { name: /cancel/i }).click();
    await expect(this.latestOrderRow()).toContainText('Cancelled', {
      timeout: TimeoutValue.EXPECT,
    });
  }

  private latestOrderRow(): Locator {
    return this.page.locator('tbody tr').first();
  }
}
