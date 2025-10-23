import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod/v4";

const mcpmConfigSchema = z.object({
  servers: z.array(z.string()),
  clients: z.array(z.string()),
});

/**
 *
 * @param cwd - The current working directory to load the config from.
 * @returns The loaded config.
 */
export const loadMcpmJson = async (cwd: string): Promise<McpmConfig> => {
  if (!existsSync(path.join(cwd, "mcpm.json"))) {
    return {
      servers: [],
      clients: [],
    };
  }
  if (!await fs.stat(path.join(cwd, "mcpm.json")).then((stat) => stat.isFile())) {
    throw new Error("mcpm.json is not a file");
  }
  const config = await fs.readFile(path.join(cwd, "mcpm.json"), "utf-8");
  return mcpmConfigSchema.parse(JSON.parse(config as unknown as string));
};

/**
 * Saves the config to the current working directory.
 * @param cwd - The current working directory to save the config to.
 * @param config - The config to save.
 */
export const saveMcpmJson = async (cwd: string, config: McpmConfig): Promise<void> => {
  await fs.writeFile(path.join(cwd, "mcpm.json"), JSON.stringify(config, null, 2));
};

export type McpmConfig = z.infer<typeof mcpmConfigSchema>;
export type SupportedClient = z.infer<typeof supportedClients>;
