# Packaging

Windows-first release packaging for GenSource.Template.

## Prerequisites

Same as development: Node 22, Rust/Cargo, and [Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/). Packaging also uses:

- Custom NSIS hooks in [`src-tauri/nsis/`](../../src-tauri/nsis/)
- [`other/utilities/7zr.exe`](../utilities/7zr.exe) for archive-related tooling

## Desktop bundle

```bash
npm run tauri:build
```

This runs the logged Tauri build wrapper (`src/scripts/log-tauri-build.js`). Build output is teed under `other/logging/build/` with timestamped log files.

## Release package

```bash
npm run package
npm run package:clean   # wipe release/ first, then package
```

[`src/scripts/package.js`](../../src/scripts/package.js) builds for both:

- `x86_64-pc-windows-msvc` (x64)
- `i686-pc-windows-msvc` (x86)

Artifacts land in `release/` as NSIS installers (per-user or system-wide, via the custom installer hooks) and matching portable zip builds.

## Notes

- Platform focus is **Windows**; macOS/Linux packaging is out of scope for this template.
- Prefer `package` / `package:clean` when you need both architectures and portable zips in one pass.
- For a single Tauri NSIS bundle without the multi-arch packaging step, `tauri:build` is enough.
