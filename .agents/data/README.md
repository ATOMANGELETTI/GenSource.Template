# data/

Structured datasets (JSON/CSV/YAML) that agents or skills may need to read
— lookup tables, fixtures, seed data — as opposed to prose documentation
(which belongs in [`../documents/`](../documents/)).

- **Naming**: descriptive lowercase-hyphenated filenames with an appropriate
  extension, e.g. `known-tauri-permissions.json`.
- **Content**: any structured data file an agent/skill should be able to
  read without executing code. Keep large or binary datasets out of git if
  they don't belong in version control; prefer small, reviewable files.

No data files exist yet.
