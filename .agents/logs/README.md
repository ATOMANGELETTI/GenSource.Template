# logs/

Run/audit logs written by agents or skills during execution — an output
location, not an input one. Useful for skills (like `create-skill-pro`'s
scripts) that want to leave a record of what they scaffolded or validated.

- **Naming**: `<tool-or-skill-name>-<date>.log`, or one growing log per tool.
- **Content**: plain-text or JSON-lines execution records. Treat this folder
  as disposable/gitignored if logs get noisy — check `.gitignore` before
  committing large or frequent log output.

No logs exist yet.
