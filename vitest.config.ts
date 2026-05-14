import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/application/services/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/application/services/**/*.service.ts'],
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  },
});
