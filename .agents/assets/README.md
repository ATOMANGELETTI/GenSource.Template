# assets/

Shared static assets and templates available to **any** agent, skill, or
persona in this project — distinct from a skill's own per-skill `assets/`
folder, which holds material specific to just that one skill.

- **Naming**: descriptive lowercase-hyphenated filenames, grouped in
  subfolders by kind if the collection grows (e.g. `icons/`, `templates/`).
- **Content**: boilerplate files, starter templates, icons/images, or any
  other file meant to be copied verbatim into generated output.

Nothing project-wide exists yet. Per-skill template material (e.g. the
`SKILL.md` boilerplate used to scaffold new skills) lives in
[`../skills/create-skill-pro/assets/`](../skills/create-skill-pro/assets/)
instead, since it's specific to that one skill.
