# mcp/

Model Context Protocol (MCP) server configs/definitions available to agents
working in this project — a project-local, portable alternative/complement
to tool-specific MCP config (e.g. Cursor's own MCP settings).

- **Naming**: `<server-name>.json` (or a single `servers.json` listing all of
  them), matching the MCP server config schema.
- **Content**: connection details for MCP servers this project's agents
  should have access to (e.g. a project-specific database or docs server).
  Never commit secrets/tokens here — reference environment variables
  (see the `.env*` files at the repo root) instead.

No MCP server configs exist yet.
