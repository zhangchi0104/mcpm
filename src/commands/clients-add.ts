import { Command } from "@commander-js/extra-typings";
import { loadMcpmJson, saveMcpmJson } from "../config";
import { getResourceLoader } from "../lib/resource-loader";

const clientsAddCommand = new Command("clients:add")
  .argument("<name>", "The name of the client to add")
  .action(async (name) => {
    const loader = await getResourceLoader("local-js");
    const client = await loader.getClient(name);
    if (!client) {
      console.error(`Client ${name} not found, please run "mcpm clients:list --all" to see the available clients`);
      process.exit(1);
    }
    const mcpmJson = await loadMcpmJson(process.cwd());
    // check if the client is already exists
    if (mcpmJson.clients.includes(name)) {
      console.error(`Client ${name} already exists, please remove it before adding it again`);
      process.exit(1);
    }
    const newClients = [...mcpmJson.clients, name].sort((a, b) => a.localeCompare(b));
    await saveMcpmJson(process.cwd(), {
      ...mcpmJson,
      clients: newClients,
    });
    console.log(`Client ${name} added successfully`);
  });

export { clientsAddCommand };
