import type KnipConfig from 'knip';

const config: KnipConfig = {
  entry: [
    'src/app/main.tsx',
    'src/configs/vite.config.ts',
    'src/configs/vitest.config.ts',
    'src/configs/playwright.config.ts',
  ],
  project: ['src/app/**/*.{ts,tsx}', 'src/configs/**/*.{ts,js}'],
  ignore: ['src/app/vite-env.d.ts'],
  ignoreDependencies: ['@tauri-apps/cli'],
  vite: {
    config: ['src/configs/vite.config.ts'],
  },
  vitest: {
    config: ['src/configs/vitest.config.ts'],
    entry: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
  },
  playwright: {
    config: ['src/configs/playwright.config.ts'],
    entry: ['tests/**/*.{test,spec}.{ts,tsx}'],
  },
};

export default config;
