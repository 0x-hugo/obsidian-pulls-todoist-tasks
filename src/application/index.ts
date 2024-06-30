import { App } from "obsidian";
import { TaskServices, FileOperations } from "../domain/types";
import { createTasksServices } from "../domain/task/taskService";
import { downloadTasksFromFileParams } from "./useCases/downloadCompletedTasks";
import { ObsidianAppSettings } from "../infrastructure/obsidian/pluginSettings";
import { convertToAppConfig } from "../domain/config/appConfig";

export const createAppServices = (
  fileOps: FileOperations,
  settings: ObsidianAppSettings,
  app: App
) => {
  const domainServices: TaskServices = createTasksServices(fileOps);
  const appConfig = convertToAppConfig(settings);
  const downloadTasks = (filePath: string) =>
    downloadTasksFromFileParams(domainServices, fileOps, appConfig, app)(filePath);

  return { downloadTasks };
};

// Re-export everything from domain
export * from '../domain/types';
export * from '../domain/task/taskService';
export * from '../domain/config/appConfig';
export * from '../domain/timeframe/timeframeExtractor';

// Export application-specific items
export * from './useCases/downloadCompletedTasks';
// export type { createAppServices };

// Re-export infrastructure items if needed
export type { ObsidianAppSettings } from "../infrastructure/obsidian/pluginSettings";

// Add any other exports from the application layer hertype 