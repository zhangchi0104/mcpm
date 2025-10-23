import { globSync } from "node:fs";
import path, { parse } from "node:path";
import { defineConfig } from "rolldown";

const serverFiles = Object.fromEntries(
  globSync("./src/definitions/servers/*.ts")
    .map((file) => parse(file))
    .map((file) => [`definitions/servers/${file.name}`, path.join(file.dir, file.base)]),
);

const clientFiles = Object.fromEntries(
  globSync("./src/definitions/clients/*.ts")
    .map((file) => parse(file))
    .map((file) => [`definitions/clients/${file.name}`, path.join(file.dir, file.base)]),
);

export default defineConfig([
  {
    input: {
      index: "src/index.ts",
      ...serverFiles,
      ...clientFiles,
    },
    platform: "node",
    output: {
      dir: "dist",
    },
  },
]);
