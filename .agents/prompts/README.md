# prompts/

Reusable standalone prompt snippets/templates — text meant to be pasted into
a conversation or interpolated by a script, as opposed to behavioral
instructions for an agent to follow autonomously.

- **Naming**: `<name>.md`, lowercase-hyphenated.
- **Content**: a prompt template, optionally with `{{PLACEHOLDER}}` tokens
  for values filled in at use time.

## Minimal example

```markdown
Summarize the changes in {{PR_URL}} for a release-notes entry, grouped by
feat/fix/chore per this repo's commitlint conventions.
```

No prompts exist yet.
