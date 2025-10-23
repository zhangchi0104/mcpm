import { globSync } from "node:fs";
import path from "node:path";
import { Command } from "@commander-js/extra-typings";
import { DEFINITIONS_DIR } from "../constants";
import { type McpServerSchema, mcpServerSchema } from "../lib/definitions/mcp-server";

export const serversList = (() => {
  const command = new Command("servers:list");
  // options
  command.option("-a, --all", "List all servers").action(async () => {
    const serverConfigs = globSync(path.join(DEFINITIONS_DIR, "servers", "*.{ts,js}"));
    const sortedServerConfigs = serverConfigs.sort((a, b) => a.localeCompare(b));
    const servers: McpServerSchema[] = [];
    for (const serverConfig of sortedServerConfigs) {
      const { default: server } = await import(serverConfig);
      const parsed = mcpServerSchema.parse(server);
      servers.push({
        name: parsed.name,
        description: !parsed.description ? "No description" : parsed.description,
        defualtTransport: parsed.defualtTransport,
      });
    }
    console.table(servers);
  });
  return command;
})();
