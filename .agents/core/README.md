# core/

Foundational, shared configuration and context that most other `.agents/`
primitives (skills, agents, instructions) may want to load or link back to —
a place for cross-cutting conventions that don't belong to any single
skill/agent/rule.

- **Naming**: descriptive lowercase-hyphenated filenames, e.g.
  `conventions.md`, `glossary.md`.
- **Content**: project-wide conventions, terminology, or shared constants
  referenced from multiple other `.agents/` files. Keep it small — most
  project-specific detail belongs in
  [`../skills/create-skill-pro/references/project-context.md`](../skills/create-skill-pro/references/project-context.md)
  or [`../documents/`](../documents/) instead.

Nothing here yet; the project overview currently lives in the root
[`AGENTS.md`](../AGENTS.md).
