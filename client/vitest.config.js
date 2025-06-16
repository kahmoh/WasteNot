// vitest.config.ts or vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // enables `describe`, `it`, `expect` globally
    setupFiles: './vitest.setup.js', // optional setup (see below)
  },
});
