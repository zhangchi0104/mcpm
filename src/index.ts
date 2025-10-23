import { program } from "@commander-js/extra-typings";
import { clientsAddCommand } from "./commands/clients-add";
import { serverAdd } from "./commands/servers-add";
import { serversList } from "./commands/servers-list";
import { syncCommand } from "./commands/sync";

const cli = program;

cli.addCommand(serversList).addCommand(serverAdd).addCommand(clientsAddCommand).addCommand(syncCommand);

cli.parse(process.argv);
