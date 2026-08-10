# scripts/

Shared executable helpers usable by *any* agent/skill in this project —
distinct from a skill's own per-skill `scripts/` folder, which holds code
specific to just that one skill.

- **Naming**: descriptive lowercase-hyphenated filenames, e.g. `.mjs` (Node,
  matching this repo's existing npm toolchain) or `.ps1` for
  Windows/PowerShell-specific helpers.
- **Content**: promote a script here from a skill's `scripts/` folder once
  more than one skill/agent needs it.

Nothing project-wide exists yet. `create-skill-pro`'s own scaffolding/
validation scripts live in
[`../skills/create-skill-pro/scripts/`](../skills/create-skill-pro/scripts/)
since they're currently only used by that one skill.
