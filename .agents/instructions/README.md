# instructions/

Standing, always-relevant routing guidance for a domain — loaded whenever an
agent is working in that domain, as opposed to a skill (loaded on-demand for
a specific multi-step task) or a rule (a hard constraint).

- **Naming**: `<name>.instructions.md`, lowercase-hyphenated.
- **Content**: short, durable guidance an agent should keep in mind for an
  entire session in a given area — e.g. "when touching `src-tauri/capabilities/`,
  always cross-check both `default.json` and `desktop.json`."

## Minimal example

```markdown
---
name: tauri-capabilities
description: Routing guidance for any change touching Tauri v2 permissions.
---

Whenever a Tauri command's required permissions change, update both
`src-tauri/capabilities/default.json` and `src-tauri/capabilities/desktop.json`,
and regenerate `src-tauri/gen/schemas/desktop-schema.json` if the CLI provides
a schema-generation step.
```

No instructions exist yet — add one when a domain needs standing guidance
beyond what fits in a single skill.
