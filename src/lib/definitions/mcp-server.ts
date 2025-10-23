import { z } from "zod/v4";

const clientOptionsSchema = z
  .object({
    env: z.record(z.string(), z.string()).describe("The environment variables to set for the server."),
    args: z.array(z.string()).describe("The arguments to pass to the server."),
    headers: z.record(z.string(), z.string()).describe("The headers to set for the server."),
    extraArgs: z.array(z.string()).describe("The extra arguments to pass to the server."),
    extraHeaders: z.record(z.string(), z.string()).describe("The extra headers to set for the server."),
    extraEnvs: z.record(z.string(), z.string()).describe("The extra environment variables to set for the server."),
  })
  .partial();

const mcpRemoteSchema = z
  .object({
    url: z.url().describe("The URL of the remote server."),
    headers: z.record(z.string(), z.string()).describe("The headers to set for the remote server.").optional(),
    postAddNotice: z.string().optional(),
  })
  .strict();

const mcpLocalSchema = z
  .object({
    command: z.string().describe("The command to run the local server."),
    args: z.array(z.string()).describe("The arguments to pass to the local server.").optional(),
    env: z.record(z.string(), z.string()).describe("The environment variables to set for the local server.").optional(),
    postAddNotice: z.string().optional(),
  })
  .strict();

export const mcpServerSchema = z
  .object({
    name: z.string().describe("The name of the server.").min(1, "Name is required"),
    description: z.string().describe("The description of the server.").optional(),
    defualtTransport: z
      .union([z.literal("local"), z.literal("http"), z.literal("sse")])
      .describe("The default transport to use for the server."),
    clientSettings: clientOptionsSchema.describe("The client settings to set for the server.").optional(),
    transports: z
      .object({
        http: mcpRemoteSchema.describe("The remote server settings to set for the server.").optional(),
        sse: mcpRemoteSchema.describe("The sse server settings to set for the server.").optional(),
        local: mcpLocalSchema.describe("The local server settings to set for the server.").optional(),
      })
      .optional(),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (!val.transports || Object.keys(val.transports).length === 0) {
      ctx.addIssue({
        code: "invalid_key",
        message: "Transports are required",
        input: val,
        origin: "record",
        issues: [],
      });
    }
  });

export const defineMcpServer = (options: McpServerSchema): McpServerSchema =>
  Object.freeze(mcpServerSchema.parse(options));

export type McpServerSchema = z.infer<typeof mcpServerSchema>;
export type McpLocalTransportSchema = z.infer<typeof mcpLocalSchema>;
export type McpRemoteTransportSchema = z.infer<typeof mcpRemoteSchema>;

export type McpTransportSchema = McpLocalTransportSchema | McpRemoteTransportSchema;
