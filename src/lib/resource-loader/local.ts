import { globSync } from "node:fs";
import path from "node:path";
import { DEFINITIONS_DIR } from "../../constants";
import { type McpClientSchema, mcpClientSchema } from "../definitions/mcp-client";
import type { McpServerSchema } from "../definitions/mcp-server";
import { mcpServerSchema } from "../definitions/mcp-server";
import type { IConfigLoader } from "./base";

/**
 *
 * @param baseDir - The base directory to load the servers from.
 * @returns A config loader that can load servers from a directory of JavaScript modules.
 */
export function defineJsModuleLoader(baseDir: string): IConfigLoader {
  return {
    listServers: async () => {
      const serverConfigs = globSync(path.join(baseDir, "servers", "*.{ts,js}"));
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
      return servers;
    },

    getServer: async (id: string) => {
      const serverConfig = globSync(path.join(baseDir, "servers", "*.{ts,js}"));
      const sortedServerConfigs = serverConfig.sort((a, b) => a.localeCompare(b));
      const server = sortedServerConfigs.find((server) => server.includes(id));
      if (!server) {
        return null;
      }
      return mcpServerSchema.parse(await import(server).then((m) => m.default));
    },

    hasServer: async (id: string) => {
      const serverConfig = globSync(path.join(baseDir, "servers", "*.{ts,js}"));
      const sortedServerConfigs = serverConfig.sort((a, b) => a.localeCompare(b));
      return sortedServerConfigs.some((server) => server.includes(id));
    },

    init: async () => {
      return Promise.resolve();
    },

    listClients: async () => {
      const clientConfigs = globSync(path.join(baseDir, "clients", "*.{ts,js}"));
      const sortedClientConfigs = clientConfigs.sort((a, b) => a.localeCompare(b));
      const clients: McpClientSchema[] = [];
      for (const clientConfig of sortedClientConfigs) {
        const { default: client } = await import(clientConfig);
        clients.push(mcpClientSchema.parse(client));
      }
      return clients;
    },

    getClient: async (id: string) => {
      const clientConfig = globSync(path.join(baseDir, "clients", "*.{ts,js}"));
      const sortedClientConfigs = clientConfig.sort((a, b) => a.localeCompare(b));
      const client = sortedClientConfigs.find((client) => client.includes(id));
      if (!client) {
        return null;
      }
      return mcpClientSchema.parse(await import(client).then((m) => m.default));
    },

    hasClient: async (id: string) => {
      const clientConfig = globSync(path.join(baseDir, "clients", "*.{ts,js}"));
      const sortedClientConfigs = clientConfig.sort((a, b) => a.localeCompare(b));
      return sortedClientConfigs.some((client) => client.includes(id));
    },
  };
}

export const defaultConfigLoader = defineJsModuleLoader(DEFINITIONS_DIR);
