import type { McpClientSchema } from "../definitions/mcp-client";
import type { McpServerSchema } from "../definitions/mcp-server";

export interface IConfigLoader {
  /**
   *
   * @returns A list of servers.
   */
  listServers: () => Promise<McpServerSchema[]>;
  /**
   * Get a server by its id.
   *
   * @param id - The id of the server to get.
   * @returns The server or null if it is not found.
   */
  getServer: (id: string) => Promise<McpServerSchema | null>;
  /**
   * Initialize the config loader.
   *
   * @returns A promise that resolves when the config loader is initialized.
   */

  hasServer: (id: string) => Promise<boolean>;
  /**
   * Initialize the config loader.
   *
   * @returns A promise that resolves when the config loader is initialized.
   */
  init: () => Promise<void>;
  /**
   *
   * @returns A list of clients.
   */
  listClients: () => Promise<McpClientSchema[]>;
  /**
   * Get a client by its id.
   *
   * @param id - The id of the client to get.
   * @returns The client or null if it is not found.
   */
  getClient: (id: string) => Promise<McpClientSchema | null>;
  /**
   * Check if a client exists.
   *
   * @param id - The id of the client to check.
   * @returns True if the client exists, false otherwise.
   */
  hasClient: (id: string) => Promise<boolean>;
}
