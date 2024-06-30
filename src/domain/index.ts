export * from './types';
export * from './coreFunctions';
export * from './composition';

import { App } from "obsidian";
import { CoreFunctions, FileOperations } from "./types";
import { createCoreFunctions } from "./coreFunctions";
import { downloadTasksFromFileParams } from "./composition";
import { ObsidianAppSettings } from "../components/obsidianPluginSettings";
import { AppSettings } from "./types";

export const createDomainFunctions = (fileOps: FileOperations) => {
  const coreFuncs: CoreFunctions = createCoreFunctions(fileOps);
  const convertToAppConfig = (settings: ObsidianAppSettings) => {
    return {
      keywordSegmentStart: settings.keywordSegmentStart,
      keywordSegmentEnd: settings.keywordSegmentEnd,
      authToken: settings.authToken,
    } as AppSettings;
  };
  return {
    downloadTasksFromFileParams: (filePath: string, settings: ObsidianAppSettings, app: App) =>
      downloadTasksFromFileParams(coreFuncs, fileOps)(filePath, convertToAppConfig(settings), app),
  };
};