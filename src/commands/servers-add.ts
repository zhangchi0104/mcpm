import { Command } from "@commander-js/extra-typings";
import { z } from "zod/v4";
import { loadMcpmJson, saveMcpmJson } from "../config";
import { getResourceLoader } from "../lib/resource-loader";

const serverAdd = new Command("servers:add")
  .option("-t, --transport <transport>", "The transport to use for the server", (s) =>
    z
      .union([z.literal("local"), z.literal("http"), z.literal("sse")])
      .optional()
      .parse(s),
  )
  .argument("<name>", "The name of the server to add")
  .action(async (name, options) => {
    const loader = await getResourceLoader("local-js");
    const server = await loader.getServer(name);
    if (!server) {
      console.error(`Server ${name} not found, please run "mcpm servers:list --all" to see the available servers`);
      process.exit(1);
    }
    const transport = options.transport || server.defualtTransport;
    if (!server.transports?.[transport]) {
      console.error(
        `Transport ${transport} not found for server ${name}, please run "mcpm servers:list --all" to see the available transports`,
      );
      process.exit(1);
    }
    const serverConfigEntry = `${name}:${transport}`;
    console.log(`Server ${serverConfigEntry} added successfully`);
    const mcpmJson = await loadMcpmJson(process.cwd());
    // check if the server is already exists
    const similarResults = mcpmJson.servers.filter((server) => server.startsWith(`${name}:`));
    if (similarResults.length > 0) {
      console.error(`Server ${name} ${similarResults.join(", ")} already exists, please either reomve them before adding ${name} with ${transport}`);
      process.exit(1);
    }
    const newServers = [...mcpmJson.servers, serverConfigEntry].sort((a, b) => a.localeCompare(b));
    await saveMcpmJson(process.cwd(), {
      ...mcpmJson,
      servers: newServers,
    });

  });

export { serverAdd };
