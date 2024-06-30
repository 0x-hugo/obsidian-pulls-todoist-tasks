import { TodoistTask } from "export-todoist-api";
import { App, Notice } from "obsidian";
import { AppSettings, CoreFunctions, DateGroupedTasks, FileOperations } from "./types";

export const downloadTasksFromFileParams = (coreFuncs: CoreFunctions, fileOps: FileOperations) =>
  async (filePath: string, settings: AppSettings, app: App): Promise<void> => {
    const downloadTasks = downloadTasksInFolders(coreFuncs, fileOps);
    const fileContent = await fileOps.readFile(filePath);
    const fileParams = coreFuncs.findTimeFramesInFile(fileContent);
    const tasks = await coreFuncs.fetchCompletedTasks(settings.authToken, fileParams);
    const groupedTasks = coreFuncs.groupTasksByDate(tasks);
    const filteredGroupedTasks: DateGroupedTasks = coreFuncs.filterInvalidTasks(groupedTasks);

    const currentPath = app.workspace.getActiveFile()?.parent?.path ?? '';

    await downloadTasks(filteredGroupedTasks, currentPath);

    new Notice("Completed tasks loaded.");
  };

const downloadTasksInFolders = (coreFuncs: CoreFunctions, fileOps: FileOperations) =>
  async (tasks: DateGroupedTasks, currentPath: string) =>
    Promise.all(
      Object.entries(tasks).map(t =>
        processTaskGroup(coreFuncs, fileOps)(currentPath, t))
    );



const partitionTasks = (tasks: TodoistTask[]): [TodoistTask[], TodoistTask[]] => {
  const isDailyTask = (task: TodoistTask) => !task.sectionId || task.sectionName?.includes('tasks');
  return [
    tasks.filter(isDailyTask),
    tasks.filter(task => !isDailyTask(task))
  ];
};

const processTaskGroup = (coreFuncs: CoreFunctions, fileOps: FileOperations) =>
  async (currentPath: string, [date, tasks]: [string, TodoistTask[]]) => {
    const [year, month, day] = date.split("-");
    const monthFolderPath = `${currentPath}/completed-tasks/${year}/${month}`;
    const dailyFolderPath = `${monthFolderPath}/${year}-${month}-${day}`;

    const [dailyTasks, projectTasks] = partitionTasks(tasks);

    await Promise.all([
      fileOps.createFolder(monthFolderPath),
      fileOps.createFolder(dailyFolderPath),
      coreFuncs.upsertTasks(projectTasks, monthFolderPath),
      coreFuncs.upsertTasks(dailyTasks, dailyFolderPath)
    ]);
  };

