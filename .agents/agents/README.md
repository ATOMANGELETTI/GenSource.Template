# agents/

Named sub-agent personas that can be invoked as delegates for a specific
kind of work (e.g. a dedicated reviewer, planner, or debugger persona).

- **Naming**: `<name>.agent.md`, lowercase-hyphenated.
- **Content**: a short persona description (role, expertise, tone) plus any
  standing instructions specific to that persona. Keep it focused — if the
  persona needs a multi-step reusable procedure, have it reference a skill
  in [`../skills/`](../skills/) rather than duplicating instructions here.

## Minimal example

```markdown
---
name: rust-reviewer
description: Reviews Rust changes under src-tauri/ for idiomatic error handling and Tauri command safety.
---

# Rust Reviewer

Review Rust diffs for: unwraps that should be `?`, missing `#[tauri::command]`
error mapping, and capability/permission drift against `src-tauri/capabilities/*.json`.
```

No agent personas exist yet — add one when a recurring role emerges.
