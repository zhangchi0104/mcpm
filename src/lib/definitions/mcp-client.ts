import path from "node:path";
import { z } from "zod/v4";

const outputSchema = z.object({
  format: z.union([z.literal("json"), z.literal("yaml"), z.literal("toml")]).describe("The format of the client."),
  localPath: z.string().describe("The path to the local file.").transform((val) => path.resolve(val)),
  globalPath: z.string().describe("The path to the global file.").transform((val) => path.resolve(val)).optional(),
})
export const mcpClientSchema = z.object({
  name: z.string().describe("The name of the client.").min(1, "Name is required"),
  description: z.string().describe("The description of the client.").optional(),
  output: outputSchema.describe("The output of the client."),
});

export const defineMcpClient = (options: McpClientSchema): McpClientSchema => {
  return Object.freeze(mcpClientSchema.parse(options));
};


export type McpClientSchema = z.infer<typeof mcpClientSchema>;
