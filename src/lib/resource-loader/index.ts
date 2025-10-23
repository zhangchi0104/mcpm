import type { IConfigLoader } from "./base";
import { defaultConfigLoader } from "./local";


export async function getResourceLoader(loaderType: 'local-js'): Promise<IConfigLoader>;
export async function getResourceLoader(loaderType: string): Promise<IConfigLoader> {
  switch (loaderType) {
    case 'local-js':
      return defaultConfigLoader;
    default:
      throw new Error(`Unsupported loader type: ${loaderType}`);
  }
}

