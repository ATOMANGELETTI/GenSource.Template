import type KnipConfig from 'knip';

const config: KnipConfig = {
  entry: [
    // Kitchen-sink plugin JS bindings registered in Rust but not yet called
    // from the UI entry graph.
    'src/app/lib/tauri-plugin-bindings.ts',
    'src/configs/middleware.ts',
  ],
  project: ['src/app/**/*.{ts,tsx}', 'src/configs/**/*.{ts,js}'],
  ignore: [
    // tsc emit next to sources; not hand-maintained entrypoints.
    'src/configs/**/*.d.ts',
    // Vitest is the unit runner; keep Jest config for optional local use.
    'src/configs/jest.config.ts',
  ],
  ignoreDependencies: [
    // Peer of `@tailwindcss/vite` (imported in vite.config.ts).
    'tailwindcss',
  ],
  vite: {
    config: ['src/configs/vite.config.ts'],
  },
  vitest: {
    config: ['src/configs/vitest.config.ts'],
    entry: ['tests/unit/**/*.{test,spec}.{ts,tsx}', 'tests/unit/setup.ts'],
  },
  playwright: {
    config: ['src/configs/playwright.config.ts'],
    entry: ['tests/**/*.{test,spec}.{ts,tsx}'],
  },
};

export default config;
