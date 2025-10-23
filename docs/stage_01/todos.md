## Stage 1 — Todos

- [ ] Wire CLI entrypoint in `src/index.ts` to run `cli`.
- [ ] Add `bin` mapping `mcpm` to `dist/index.js` in `package.json`.
- [ ] Add Bun `build` and `dev` scripts using `rolldown`.
- [ ] Define Zod config schema in `src/config/schema.ts`.
- [ ] Implement `loadConfig` in `src/config/index.ts`.
- [ ] Implement `saveConfig` in `src/config/index.ts`.
- [ ] Implement `addServer` and `addClient` helpers with dedupe.
- [ ] Create default `mcpm.json` when missing.
- [ ] Create servers registry with `context7` metadata.
- [ ] Create clients registry with `cursor` and `claude-code`.
- [ ] Setup CLI name, version, and help in `src/cli.ts`.
- [ ] Register `server-add`, `client-add`, and `sync` commands.
- [ ] Implement `server:add` command with `--list` option.
- [ ] Validate `serverId` via `serverRegistry` in `server:add`.
- [ ] Update config to add server and persist.
- [ ] Implement `client:add` command with `--list` option.
- [ ] Validate `clientId` via `clientRegistry` in `client:add`.
- [ ] Update config to add client and persist.
- [ ] Implement `sync` command at `src/commands/sync.ts`.
- [ ] Implement core sync logic in `src/commands/sync/index.ts`.
- [ ] Generate client configs from configured servers.
- [x] Write configs to `generated/<clientId>/config.json`.
- [ ] Add `--dry-run` to print configs to stdout.
- [ ] Validate config has at least one server and one client.
- [ ] Implement Cursor generator at `src/predefined/clients/cursor.ts`.
- [ ] Implement Claude generator at `src/predefined/clients/claude-code.ts`.
- [ ] Support `toClientConfig` transform or generic server shape.
- [ ] Add friendly errors and non-zero exit codes.
- [ ] Implement list outputs for server and client add commands.
- [ ] Ensure idempotent adds with informative messages.
- [ ] Configure `rolldown` to output ESM for Bun.
- [ ] Add shebang if distribution requires it.
- [ ] Document CLI usage examples in `README.md`.
- [ ] Document how to extend registries in `README.md`.
- [ ] (Optional) Add interactive selection when id is absent.
- [ ] (Optional) Add basic unit tests for config helpers.


