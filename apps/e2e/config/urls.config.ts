export const URLS = {
  APP: process.env.APP_URL ?? 'http://localhost:5173',
  API: process.env.API_URL ?? 'http://localhost:4000/api',
  ROUTES: {
    PRODUCTS: '/products',
    ORDERS: '/orders',
  },
};

export const getAppUrl = (route: string): string => `${URLS.APP}${route}`;
export const getApiUrl = (route: string): string => `${URLS.API}${route}`;
