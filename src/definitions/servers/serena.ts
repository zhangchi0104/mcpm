import { defineMcpServer } from "../../lib/definitions/mcp-server";

export default defineMcpServer({
  name: "serena",
  description: "Serena is a server that provides a context for the server.",
  defualtTransport: "local",
  transports: {
    local: {
      command: "uvx",
      args: ["mcp", "serve", "@upstash/serena-mcp"],
    },
  },
});
