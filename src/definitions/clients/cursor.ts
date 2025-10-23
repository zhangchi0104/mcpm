import { defineMcpClient } from "../../lib/definitions/mcp-client";

export default defineMcpClient({
  name: "cursor",
  output: {
    format: "json",
    localPath: ".cursor/mcp.json",
  },
});
