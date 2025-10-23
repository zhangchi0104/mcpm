## mcpm — Model Context Protocol Manager

mcpm helps you manage MCP (Model Context Protocol) server/client configurations and generate client-ready config files with a single command.

Built for Bun. No Node/npm/pnpm required.

### Requirements
- Bun ≥ 1.2

### Install
```bash
bun install
```

### Quick start
All commands are executed with Bun directly from TypeScript.

1) Add a client (e.g. Cursor):
```bash
bun run src/index.ts clients:add cursor
```

2) Add a server (e.g. Context7 over local or http):
```bash
# local transport (default for many servers)
bun run src/index.ts servers:add context7 --transport local

# or http transport
bun run src/index.ts servers:add context7 --transport http
```

3) Generate the client config(s):
```bash
bun run src/index.ts sync
```

Configs are written to each client’s expected location (see Supported clients below). Run these commands from the project where you want the config files to be generated. mcpm reads and writes `mcpm.json` in the current working directory.

---

### Commands

- `servers:list`
  - List available servers defined in `src/definitions/servers/*`.
  - Example:
    ```bash
    bun run src/index.ts servers:list
    ```

- `servers:add <name> [--transport <local|http|sse>]`
  - Adds a server entry to `mcpm.json`. Validates the server exists and that the chosen transport is supported.
  - Examples:
    ```bash
    bun run src/index.ts servers:add context7 --transport local
    bun run src/index.ts servers:add context7 --transport http
    ```

- `clients:add <name>`
  - Adds a client entry to `mcpm.json`.
  - Example:
    ```bash
    bun run src/index.ts clients:add cursor
    ```

- `sync` [--force] [--dry-run]
  - Generates configuration files for each configured client based on the configured servers.
  - Example:
    ```bash
    bun run src/index.ts sync
    ```

Notes:
- If a client output file already exists, mcpm will refuse to overwrite it unless forced by the implementation. The JSON writer throws unless `force` is used; the CLI may evolve to pass this flag through.
- Run the CLI from the project where you want the client config files to be created.

---

### `mcpm.json`
mcpm uses a simple config file at the project root.

```json
{
  "servers": ["context7:local", "serena:local"],
  "clients": ["cursor"]
}
```

- `servers`: items are `name:transport`.
- `clients`: items are client ids.

You can edit this file manually or manage it via the add commands.

---

### Supported servers (built-in)

- context7
  - Transports:
    - local: runs via command `npx -y @upstash/context7-mcp` (set `CONTEXT7_API_KEY` in env)
    - http: `https://mcp.context7.com/mcp` (set `CONTEXT7_API_KEY` header)

- serena
  - Transports:
    - local: runs via command `uvx mcp serve @upstash/serena-mcp`

See definitions in `src/definitions/servers/` for full details and any post‑add notices.

### Supported clients (built-in)

- cursor
  - Output: JSON at `.cursor/mcp.json`

- claude-code
  - Output: JSON at `.claude/mcp.json`

See definitions in `src/definitions/clients/` for more.

---

### Development

- List servers from source definitions:
  ```bash
  bun run src/index.ts servers:list
  ```

- Run any command directly from TS (recommended during development):
  ```bash
  bun run src/index.ts <command> [...args]
  ```

- Bundle to `dist/` using rolldown:
  ```bash
  bun run bundle
  ```

Project structure highlights:
- `src/commands/*`: CLI commands (`servers:add`, `servers:list`, `clients:add`, `sync`).
- `src/definitions/servers/*`: Built-in MCP servers and transports.
- `src/definitions/clients/*`: Built-in MCP clients and their output locations.
- `src/lib/mcp-client-writer/json.ts`: Writer that outputs `{ mcpServers: { ... } }` JSON for clients.
- `src/config.ts`: Load/save `mcpm.json` in the current working directory.

---

### Troubleshooting
- Make sure you run commands from the project where you want `.cursor/mcp.json` or `.claude/mcp.json` to be created.
- For Context7, set the `CONTEXT7_API_KEY` (env or header) depending on the chosen transport.
- If a config file already exists, remove it or re-run with an implementation that supports `--force`.

---

### License
Currently unspecified.
