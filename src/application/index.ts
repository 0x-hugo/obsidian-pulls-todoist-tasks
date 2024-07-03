import { App } from "obsidian";
import { convertToAppConfig } from "../domain/config/appConfig";
import { createTasksServices } from "../domain/task/taskService";
import { FileOperations, TaskServices } from "../domain/types";
import { ObsidianAppSettings } from "../infrastructure/obsidian/pluginSettings";
import { downloadTasksFromFileParams } from "./useCases/downloadCompletedTasks";

const createAppServices = (
  fileOps: FileOperations,
  settings: ObsidianAppSettings,
  app: App
) => {
  console.log("createAppServices: ", settings)
  const appConfig = convertToAppConfig(settings);
  console.log("appConfig: ", appConfig)
  const domainServices: TaskServices = createTasksServices(fileOps);
  const downloadTasks = (filePath: string) =>
    downloadTasksFromFileParams(domainServices, fileOps, appConfig, app)(filePath);

  return { downloadTasks };
};

export { hasFileParams } from '../domain/timeframe/timeframeExtractor';
export type { ObsidianAppSettings } from "../infrastructure/obsidian/pluginSettings";
export { createAppServices };
export * from '../domain/types';
// export * from '../domain/task/taskService';
// export * from '../domain/config/appConfig';
// export * from '../domain/timeframe/timeframeExtractor';
