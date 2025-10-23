import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { McpClientSchema } from "../definitions/mcp-client";
import type { McpTransportSchema } from "../definitions/mcp-server";

export async function writeJson({
  serverConfig,
  clientConfig,
  force = false,
}: {
  serverConfig: Record<string, McpTransportSchema>;
  clientConfig: McpClientSchema;
  force?: boolean;
}): Promise<void> {
  const mcpJson = {
    mcpServers: serverConfig,
  };
  const outputPath = clientConfig.output.localPath;
  if (existsSync(outputPath) && !force) {
    throw new Error(`File ${outputPath} already exists, please remove it or use --force to overwrite it`);
  }
  if (!existsSync(path.dirname(outputPath))) {
    await mkdir(path.dirname(outputPath), { recursive: true });
  }
  await writeFile(outputPath, JSON.stringify(mcpJson, null, 2), "utf-8");
}
