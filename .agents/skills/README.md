# skills/

Portable, on-demand skill packages — the agentskills.io spec's `.agents/skills/`
convention. Each skill is a subdirectory containing a `SKILL.md` and,
optionally, its own `scripts/`, `references/`, `assets/`, `examples/`, and
`resources/`.

- **Naming**: `<name>/SKILL.md`, where `<name>` matches the `name` field in
  that file's frontmatter (1-64 chars, lowercase letters/numbers/hyphens).
- To create a new skill, use [`create-skill-pro`](create-skill-pro/SKILL.md)
  rather than starting from scratch — it scaffolds a spec-compliant skill
  tailored to this repo and checks the rest of `.agents/` for material worth
  wiring in.

## Skills in this project

- [`create-skill-pro`](create-skill-pro/SKILL.md) — creates, scaffolds, and
  audits other skills in this repo.
