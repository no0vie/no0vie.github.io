import { defineConfig } from 'vitest/config';
import { publishingConfig } from './scripts/publishing';
import { resumeDev } from './scripts/dev';

export default defineConfig({
  base: publishingConfig().base,
  plugins: [resumeDev()],
  build: { sourcemap: false },
  test: { include: ['tests/**/*.test.ts', 'scripts/**/*.test.ts'] },
});
