import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/nx-plugin-openapi-e2e',
  test: {
    name: 'nx-plugin-openapi-e2e',
    watch: false,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    reporters: ['default'],
    globalSetup: ['../../tools/scripts/start-local-registry.ts'],
    fileParallelism: false,
    testTimeout: 120000,
    hookTimeout: 600000,
    coverage: {
      reportsDirectory: '../../coverage/packages/nx-plugin-openapi-e2e',
      provider: 'v8',
    },
  },
});
