# memory/

Persistent, cross-session facts and context that agents can read and append
to — durable memory that should survive between conversations, as opposed to
one-off `logs/` output.

- **Naming**: one file per topic, e.g. `decisions.md`, `known-issues.md`.
- **Content**: short, factual notes an agent should carry forward — decisions
  made, gotchas discovered, things intentionally left as-is (e.g. the
  `mdoels` typo in `src-tauri/src/mdoels/`). Append rather than rewrite so
  history isn't lost; keep entries dated.

## Minimal example

```markdown
## 2026-08-09
- `src-tauri/src/mdoels/` is a pre-existing typo, kept intentionally to avoid
  churning `mod` paths. Do not silently rename.
```

No memory entries exist yet.
