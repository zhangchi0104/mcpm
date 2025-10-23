import { defineMcpClient } from "../../lib/definitions/mcp-client";

export default defineMcpClient({
  name: "claude-code",
  output: {
    format: "json",
    localPath: ".claude/mcp.json",
  },
});


