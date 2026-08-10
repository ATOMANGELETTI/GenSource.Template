# commands/

Reusable custom slash-command definitions — short, user-invoked shortcuts
(e.g. `/release`, `/new-command`) distinct from full skills: a command is a
single quick action, a skill is a fuller workflow (with its own
`scripts/`/`references/`/etc.) that may itself be triggered by a command.

- **Naming**: `<name>.command.md`, lowercase-hyphenated.
- **Content**: a one-line description of what the command does, followed by
  the exact steps/prompt to run.

## Minimal example

```markdown
---
name: new-tauri-command
description: Scaffold a new Tauri command handler in src-tauri/src/commands/commands.rs.
---

Add a new `#[tauri::command]` function to `src-tauri/src/commands/commands.rs`,
register it in the `invoke_handler` list in `src-tauri/src/lib.rs`, and add the
matching capability entry to `src-tauri/capabilities/default.json` if it needs
elevated permissions.
```

No commands exist yet — add one when a repetitive quick action emerges.
