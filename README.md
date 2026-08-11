# GenSource.Template

Tauri v2 + React + TypeScript desktop app template for the GenSource suite.

![GenSource Template on Windows](https://github.com/ATOMANGELETTI/GenSource.Template/blob/main/other/screenshots/screenshot-app.png)

![Custom titlebar context menu](https://github.com/ATOMANGELETTI/GenSource.Template/blob/main/other/screenshots/app-titlebar-menu.png)

![Content area context menu](https://github.com/ATOMANGELETTI/GenSource.Template/blob/main/other/screenshots/app-content-menu.png)

## Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Terminus Nerd Font (switchable)
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
| `npm run test:e2e` | Playwright visual + e2e (port 1421) |
| `npm run test:e2e:update` | Regenerate Playwright screenshot baselines |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b` |

## Layout

- `src/app/` — React UI
- `src/configs/` — Vite / Vitest / Playwright / ESLint / Knip / tsconfigs
- `src-tauri/` — Rust backend, capabilities, NSIS
- `.cursor/` — Cursor rules, skills, commands, hooks

Agent instructions: [`.cursor/AGENTS.md`](.cursor/AGENTS.md).
