import { defineMcpServer } from "../../lib/definitions/mcp-server";

export default defineMcpServer({
  name: "context7",
  description: "Context7 is a server that provides a context for the server.",
  defualtTransport: "local",
  transports: {
    local: {
      command: "npx",
      args:  ["-y", "@upstash/context7-mcp"],
      postAddNotice: "You will need to provide your API_KEY as an environment variable CONTEXT7_API_KEY"
    },
    http: {
      url: "https://mcp.context7.com/mcp",
      headers: {
        "CONTEXT7_API_KEY": "YOUR_API_KET"
      },
      postAddNotice: "You will need to replace the placeholder in header with your API_KEY"
    }
  },
});
