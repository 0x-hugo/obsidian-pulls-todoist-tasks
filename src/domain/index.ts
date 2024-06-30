export * from './types';
export * from './coreFunctions';
export * from './composition';

import { App } from "obsidian";
import { AppSettings, CoreFunctions, FileOperations } from "./types";
import { createCoreFunctions } from "./coreFunctions";
import { downloadTasksFromFileParams } from "./composition";

export const createDomainFunctions = (fileOps: FileOperations) => {
  const coreFuncs: CoreFunctions = createCoreFunctions(fileOps);
  return {
    downloadTasksFromFileParams: (filePath: string, settings: AppSettings, app: App) =>
      downloadTasksFromFileParams(coreFuncs, fileOps)(filePath, settings, app),
  };
};