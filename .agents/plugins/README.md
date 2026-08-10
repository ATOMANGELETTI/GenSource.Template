# plugins/

Bundled, multi-capability extension packages — a plugin can bring its own
agents, skills, instructions, and rules together as one installable unit,
unlike the other `.agents/` folders which each hold one kind of primitive.

- **Naming**: `<plugin-name>/`, expanded recursively; internally a plugin
  typically mirrors the top-level `.agents/` layout (its own `skills/`,
  `agents/`, etc.).
- **Content**: whatever the plugin provides. Prefer a plugin only when
  distributing/reusing a *bundle* of primitives together; for a single
  skill, add it directly to [`../skills/`](../skills/) instead.

No plugins are installed yet.
