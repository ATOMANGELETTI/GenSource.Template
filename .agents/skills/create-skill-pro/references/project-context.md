# Project context — GenSource.Template

Keep this file updated as the template's placeholder files gain real
content. It exists so skills created by `create-skill-pro` reference this
repo's actual paths and conventions instead of generic advice.

## What this repo is

A **Tauri v2** desktop app template: React + TypeScript frontend, Rust
backend, packaged for Windows via NSIS. Every tracked file is currently an
empty (0-byte) placeholder — this is a scaffold meant to be cloned/generated
from, not a working app yet. Treat file/folder *names* as authoritative
intent even where content is empty.

## Frontend — `src/app/`

- `App.tsx`, `main.tsx` — app entry points.
- `pages/Window.tsx` — page components live under `pages/`.
- `styles/{app,index}.css` — global styles.
- `types/{index,tauri}.ts` — shared TS types, including Tauri IPC types.
- `vite-env.d.ts` — Vite ambient types.

A skill that adds a new page should create it under `src/app/pages/` and
follow the existing `Window.tsx` naming style (PascalCase component files).

## Config centralization — `src/configs/`

Unlike most Vite/React templates, **all tooling config is centralized**
under `src/configs/` rather than the repo root:

- `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`
- `eslint.config.js`, `knip.ts` (dead-code detection), `middleware.ts`
- `tsconfig.base.json`, `tsconfig.app.json`, `tsconfig.build.json`,
  `tsconfig.e2e.json`, `tsconfig.node.json`, `tsconfig.test.json`

The root `tsconfig.json` references these. A skill that changes build/test
tooling should edit the file under `src/configs/`, not create a new config
at the repo root.

## Backend — `src-tauri/src/`

- `lib.rs`, `main.rs` — crate entry points.
- `commands/commands.rs` — `#[tauri::command]` handlers; new commands should
  be added here and registered in the `invoke_handler` list.
- `state/state.rs` — shared Tauri state.
- `mdoels/models.rs` — data models. **Note**: `mdoels` is a pre-existing
  typo in this template's tracked path. Preserve it unless explicitly asked
  to fix it — renaming changes `mod` paths across the crate.
- `capabilities/{default,desktop}.json` — Tauri v2 permission grants. Any
  new command needing elevated permissions must be added here.
- `gen/schemas/desktop-schema.json` — generated permission schema.
- `.cargo/config.toml`, `build.rs`, `cargo.toml`/`cargo.lock`,
  `tauri.conf.json`, `tauri.windows.conf.json`.

## Packaging & tooling

- Windows installer: `src-tauri/nsis/installer.nsh`,
  `other/utilities/7zr.exe` (7-Zip), `other/configs/*.json`.
- npm-based (`.node-version`, `.nodeswitcher`, `.npmrc`).
- `commitlint` (`.commitlintrc`), `release-it` (`.release-it.json`),
  `prettier` (`.prettierrc`/`.prettierignore`).
- Multi-env: `.env`, `.env.dev`, `.env.local`, `.env.prod`, `.env.example`
  — never put real secrets in `.env.example`.

## Agent-tool configs already present

`.vscode/`, `.cursor/` (`cursor.json`, `.cursorignore`), and `.agents/`
(this folder) coexist. Prefer `.agents/` for anything meant to be portable
across agent tools; use `.cursor/` only for Cursor-specific settings.

## Conventions a new skill should follow

- Use Node (`.mjs`) for any executable scripts, matching this repo's
  existing npm toolchain — not Python/Bash, which aren't otherwise used
  here and are less Windows/PowerShell-friendly.
- Don't fabricate file contents for the placeholder files above; if a task
  needs real logic, write it, but don't invent unrelated boilerplate.
