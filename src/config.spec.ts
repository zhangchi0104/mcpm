import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadMcpmJson, type McpmConfig, saveConfig } from "./config";

describe("config", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "mcpm-test-"));
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });
  it("loadConfig reads and validates a valid mcpm.json", async () => {
    const config: McpmConfig = {
      servers: ["mcps://alpha", "local://beta"],
      clients: ["cursor", "claude-code"],
    };
    await writeFile(join(dir, "mcpm.json"), JSON.stringify(config), "utf-8");

    const loaded = await loadMcpmJson(dir);
    expect(loaded).toEqual(config);
  });

  it("loadConfig rejects invalid schema", async () => {
    // invalid client value
    const badConfig = {
      servers: ["mcps://alpha"],
      clients: ["not-a-supported-client"],
    } as unknown as McpmConfig;
    await writeFile(join(dir, "mcpm.json"), JSON.stringify(badConfig), "utf-8");

    await expect(loadMcpmJson(dir)).rejects.toThrow();
  });

  it("saveConfig writes pretty JSON and round-trips with loadConfig", async () => {
    const config: McpmConfig = {
      servers: ["s1"],
      clients: ["codex"],
    };

    await saveConfig(dir, config);

    const raw = await readFile(join(dir, "mcpm.json"), "utf-8");
    const expected = JSON.stringify(config, null, 2);
    expect(raw).toBe(expected);

    const loaded = await loadMcpmJson(dir);
    expect(loaded).toEqual(config);
  });

  it("loadConfig rejects when mcpm.json is missing", async () => {
    await rm(join(dir, "mcpm.json"), { force: true });
    await expect(loadMcpmJson(dir)).rejects.toThrow();
  });

  it("loadConfig rejects on malformed JSON", async () => {
    await writeFile(join(dir, "mcpm.json"), "{ invalid json", "utf-8");
    await expect(loadMcpmJson(dir)).rejects.toThrow();
  });

  it("loadConfig rejects when required fields are missing", async () => {
    // Missing clients
    const partial = { servers: ["a"] };
    await writeFile(join(dir, "mcpm.json"), JSON.stringify(partial), "utf-8");
    await expect(loadMcpmJson(dir)).rejects.toThrow();
  });

  it("loadConfig rejects when field types are wrong", async () => {
    // servers should be array, clients should be array of supported literals
    const wrongTypes = { servers: "not-array", clients: [123] };
    await writeFile(join(dir, "mcpm.json"), JSON.stringify(wrongTypes), "utf-8");
    await expect(loadMcpmJson(dir)).rejects.toThrow();
  });

  it("saveConfig rejects when directory does not exist", async () => {
    const nonExistent = join(tmpdir(), `mcpm-nonexistent-${Date.now()}`);
    const config: McpmConfig = { servers: ["a"], clients: ["cursor"] };
    await expect(saveConfig(nonExistent, config)).rejects.toThrow();
  });
});
