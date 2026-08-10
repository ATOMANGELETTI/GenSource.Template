# workflows/

Multi-step or multi-agent orchestration definitions — how several
agents/skills/commands compose together to accomplish something bigger than
any one of them, as opposed to a single skill's internal steps.

- **Naming**: `<name>.md`, lowercase-hyphenated.
- **Content**: an ordered sequence of steps, naming which agent/skill/command
  handles each, and how outputs from one feed into the next.

## Minimal example

```markdown
# Release Workflow

1. `commands/new-changelog.command.md` drafts release notes from commitlint history.
2. `release-it` (see `.release-it.json`) bumps the version and tags.
3. CI builds the NSIS installer via `src-tauri/nsis/installer.nsh`.
```

No workflows exist yet.
