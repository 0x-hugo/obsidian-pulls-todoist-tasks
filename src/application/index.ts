import { App } from "obsidian";
import { DomainServices, FileOperations } from "../domain/types";
import { createDomainServices } from "../domain/task/taskService";
import { downloadTasksFromFileParams } from "./useCases/downloadCompletedTasks";
import { ObsidianAppSettings } from "../infrastructure/obsidian/pluginSettings";
import { convertToAppConfig } from "../domain/config/appConfig";

export const createApplicationFunctions = (
  fileOps: FileOperations,
  settings: ObsidianAppSettings,
  app: App
) => {
  const domainServices: DomainServices = createDomainServices(fileOps);
  const appConfig = convertToAppConfig(settings);
  const downloadTasks = (filePath: string) =>
    downloadTasksFromFileParams(domainServices, fileOps, appConfig, app)(filePath);

  return { downloadTasks };
};

export * from '../domain/types';
export * from '../domain/task/taskService';
export * from './useCases/downloadCompletedTasks';
