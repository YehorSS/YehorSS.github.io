import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/',
  build: { rollupOptions: { input: ['index.html', 'steam-showcase-cutter/index.html'] } },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] },
});
