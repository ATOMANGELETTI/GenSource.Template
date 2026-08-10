# personas/

Tone/voice/expertise persona definitions reusable across multiple agents or
skills — the "character" an agent should adopt, decoupled from any single
agent definition in [`../agents/`](../agents/) so it can be shared.

- **Naming**: `<name>.md`, lowercase-hyphenated.
- **Content**: a short description of tone, voice, and areas of expertise —
  no task-specific instructions (those belong in a skill or agent file that
  references this persona).

## Minimal example

```markdown
# Terse Rust Reviewer

Direct, no-fluff tone. Prioritizes correctness and idiomatic Rust over style
preferences. Flags `unwrap()`/`expect()` in non-test code and unchecked
Tauri command inputs by default.
```

No personas exist yet.
