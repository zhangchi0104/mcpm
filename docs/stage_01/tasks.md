## Stage 1 — Implementation Tasks

### Foundations
- **Add CLI entrypoint wiring**: Create `src/index.ts` to initialize and run the `cli` instance.
- **Expose executable**: Add a `bin` entry in `package.json` mapping `mcpm` to `dist/index.js` and ensure Bun can run it (`bunx mcpm`).
- **Bundle script**: Keep `rolldown` bundle script; add `build` and `dev` scripts using Bun (`bun run bundle`).

### Config: `mcpm.json`
- **Define config schema**: Create `src/config/schema.ts` with a Zod schema for `{ servers: string[]; clients: string[] }` and exported `McpmConfig` type.
- **Config helpers**: Implement `src/config/index.ts` with:
  - `loadConfig(cwd: string): Promise<McpmConfig>` — reads `mcpm.json` from project root, validates, returns defaults when missing.
  - `saveConfig(cwd: string, config: McpmConfig): Promise<void>` — writes pretty-printed JSON.
  - `addServer(config, serverId)` / `addClient(config, clientId)` — deduplicated add; throw on unknown IDs.
- **Defaults handling**: If file absent, create with `{ servers: [], clients: [] }` and inform user.

### Registry (predefined options)
- **Servers registry**: Add `src/registry/servers.ts` exporting a `serverRegistry` map with at least `context7` and metadata (id, name, description, endpoint/config template).
- **Clients registry**: Add `src/registry/clients.ts` exporting a `clientRegistry` map with `cursor` and `claude-code` plus per-client sync strategies/targets.

### CLI bootstrap (`src/cli.ts`)
- **Program setup**: Configure `cli.name("mcpm")`, `cli.version` from `package.json`, and help/usage.
- **Command registration**: Import and register `server-add`, `client-add`, and `sync` command modules.

### Command: `server:add`
- **File**: `src/commands/server-add.ts`.
- **Behavior**:
  - Args: `<serverId>`; optionally `--list` to print available servers.
  - Validate `serverId` against `serverRegistry`.
  - Load config, add server (dedupe), save config, print status.

### Command: `client:add`
- **File**: `src/commands/client-add.ts`.
- **Behavior**:
  - Args: `<clientId>`; optionally `--list` to print available clients.
  - Validate `clientId` against `clientRegistry`.
  - Load config, add client (dedupe), save config, print status.

### Command: `sync`
- **File**: `src/commands/sync.ts` with core logic in `src/sync/index.ts`.
- **Behavior**:
  - Load `mcpm.json`.
  - For each configured client, generate that client’s config content from registered servers.
  - Write outputs to `generated/<clientId>/config.json` (create directories as needed) and print paths.
  - Support `--dry-run` to print to stdout only.
  - Validate that at least one server and one client exist; otherwise guide user.

### Sync generators
- **Cursor generator**: Implement `src/sync/clients/cursor.ts` that produces the JSON snippet Cursor expects for MCP servers (minimal Stage 1: a self-contained JSON mapping of servers by id and endpoints).
- **Claude (claude-code) generator**: Implement `src/sync/clients/claude-code.ts` that produces the Claude Desktop/CLI MCP servers snippet.
- **Server materialization**: Allow servers to provide a `toClientConfig(clientId)` transform or a generic shape that per-client mappers can consume.

### UX and validation
- **Friendly errors**: Consistent messages for unknown ids, invalid config, and IO failures; non-zero exit codes on failure.
- **List commands**: `mcpm server:add --list` and `mcpm client:add --list` output ids and descriptions from registries.
- **Idempotency**: Adding existing server/client is a no-op with a message.

### Build and distribution
- **ESM output**: Ensure `rolldown` outputs ESM compatible with Bun runtime.
- **Shebang (if needed)**: Add `#!/usr/bin/env bun` to the built file only if the distribution flow requires it; otherwise rely on `bin` + Bun.

### Documentation
- **README usage**: Add examples for `mcpm server:add context7`, `mcpm client:add cursor`, and `mcpm sync` including `--dry-run`.
- **Registry docs**: Document how to add new servers/clients to the registries.

### Nice-to-have (optional for Stage 1)
- **Interactive selection**: If no `<id>` provided for add commands, prompt to select from registry.
- **Basic unit tests**: Minimal tests for config helpers and deduplication.

