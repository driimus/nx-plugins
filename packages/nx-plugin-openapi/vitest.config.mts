import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/nx-plugin-openapi',
  test: {
    name: 'nx-plugin-openapi',
    watch: false,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/nx-plugin-openapi',
      provider: 'v8',
    },
  },
});
