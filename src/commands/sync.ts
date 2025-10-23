import { Command } from "@commander-js/extra-typings";
import { loadMcpmJson } from "../config";
import type { McpTransportSchema } from "../lib/definitions/mcp-server";
import { writeJson } from "../lib/mcp-client-writer/json";
import { getResourceLoader } from "../lib/resource-loader";

const syncCommand = new Command("sync")
  .option("-f, --force", "Force the sync", false)
  .option("-d, --dry-run", "Dry run the sync", false)
  .action(async () => {
    const { clients, servers } = await loadMcpmJson(process.cwd());
    if (clients.length === 0) {
      console.error("No clients configured, please run 'mcpm client:add' to add a client");
      process.exit(1);
    }
    if (servers.length === 0) {
      console.error("No servers configured, please run 'mcpm server:add' to add a server");
      process.exit(1);
    }
    const loader = await getResourceLoader("local-js");
    for (const client of clients) {
      const clientConfig = await loader.getClient(client);
      if (!clientConfig) {
        console.error(`Client ${client} not found, please run 'mcpm client:add' to add a client`);
        process.exit(1);
      }
      const mcpServers: Record<string, McpTransportSchema> = {};
      for (const server of servers) {
        const [serverName, serverTransport] = server.split(":");
        if (!serverName || !serverTransport) {
          console.error(`Invalid server configuration: ${server}, please run 'mcpm server:add' to add a server`);
          process.exit(1);
        }
        const serverConfig = await loader.getServer(serverName);

        if (!serverConfig) {
          console.error(`Server ${server} not found, please run 'mcpm server:add' to add a server`);
          process.exit(1);
        }
        const transportConfig = serverConfig.transports?.[serverTransport as keyof typeof serverConfig.transports];
        if (!transportConfig) {
          console.error(
            `Transport ${serverTransport} not found for server ${serverName}, please run 'mcpm server:add' to add a server`,
          );
          process.exit(1);
        }
        mcpServers[serverConfig.name] = transportConfig;
      }
      await writeJson({
        serverConfig: mcpServers,
        clientConfig: clientConfig,
        force: false,
      });
    }
  });

export { syncCommand };
