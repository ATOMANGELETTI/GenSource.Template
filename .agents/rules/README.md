# rules/

Hard constraints / lint-style rules that must not be violated — as opposed to
an instruction (durable guidance, but not a strict gate) or a skill
(an on-demand procedure).

- **Naming**: `<name>.rules.md`, lowercase-hyphenated.
- **Content**: a short, unambiguous constraint an agent must always respect.

## Minimal example

```markdown
---
name: no-secrets-in-env-example
description: .env.example must never contain real secret values.
---

`.env.example` documents required variable names only. Never fill it in with
real values from `.env`, `.env.local`, `.env.dev`, or `.env.prod`.
```

No rules exist yet.
