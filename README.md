# GenSource.Template

Tauri v2 + React + TypeScript desktop app template for the GenSource suite.

## Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Plus Jakarta Sans
- **UI:** Nord Polar Night, macOS-style custom titlebar (traffic lights), flat design
- **Backend:** Tauri 2 with a kitchen-sink of official desktop plugins
- **Tooling:** Vitest, Playwright, ESLint, Prettier, Knip, commitlint, release-it
- **Configs:** centralized under `src/configs/`

## Develop

```bash
npm install
npm run tauri:dev
```

Frontend only:

```bash
npm run dev
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run tauri:dev` | Vite + Tauri desktop |
| `npm run build` | Typecheck + Vite production build |
| `npm run tauri:build` | Windows NSIS bundle |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b` |

## Layout

- `src/app/` — React UI
- `src/configs/` — Vite / Vitest / Playwright / ESLint / Knip / tsconfigs
- `src-tauri/` — Rust backend, capabilities, NSIS
- `.cursor/` — Cursor rules, skills, commands, hooks

Agent instructions: [`.cursor/AGENTS.md`](.cursor/AGENTS.md).
