import { TodoistTask } from "export-todoist-api";
import { App, Notice } from "obsidian";
import { AppSettings, DateGroupedTasks, FileOperations, DomainServices } from "../../domain/types";

export const downloadTasksFromFileParams = (
  domainServices: DomainServices,
  fileOps: FileOperations,
  settings: AppSettings,
  app: App
) =>
  async (filePath: string): Promise<void> => {
    const downloadTasks = downloadTasksInFolders(domainServices, fileOps);
    const fileContent = await fileOps.readFile(filePath);
    const fileParams = domainServices.findTimeFramesInFile(fileContent);
    const tasks = await domainServices.fetchCompletedTasks(settings.authToken, fileParams);
    const groupedTasks = domainServices.groupTasksByDate(tasks);
    const filteredGroupedTasks: DateGroupedTasks = domainServices.filterInvalidTasks(groupedTasks);

    const currentPath = app.workspace.getActiveFile()?.parent?.path ?? '';

    await downloadTasks(filteredGroupedTasks, currentPath);

    new Notice("Completed tasks loaded.");
  };

const downloadTasksInFolders = (domainServices: DomainServices, fileOps: FileOperations) =>
  async (groupedTasks: DateGroupedTasks, currentPath: string) =>
    Promise.all(
      Object.entries(groupedTasks).map(([date, tasks]: [string, TodoistTask[]]) =>
        processTaskGroup(domainServices, fileOps)(currentPath, [date, tasks]))
    );



const partitionTasks = (tasks: TodoistTask[]): [TodoistTask[], TodoistTask[]] => {
  const isDailyTask = (task: TodoistTask) => !task.sectionId || task.sectionName?.includes('tasks');
  return [
    tasks.filter(isDailyTask),
    tasks.filter(task => !isDailyTask(task))
  ];
};

const processTaskGroup = (domainServices: DomainServices, fileOps: FileOperations) =>
  async (currentPath: string, [date, tasks]: [string, TodoistTask[]]) => {
    const [year, month, day] = date.split("-");
    const monthFolderPath = `${currentPath}/completed-tasks/${year}/${month}`;
    const dailyFolderPath = `${monthFolderPath}/${year}-${month}-${day}`;

    const [dailyTasks, projectTasks] = partitionTasks(tasks);

    await Promise.all([
      fileOps.createFolder(monthFolderPath),
      fileOps.createFolder(dailyFolderPath),
      domainServices.upsertTasks(projectTasks, monthFolderPath),
      domainServices.upsertTasks(dailyTasks, dailyFolderPath)
    ]);
  };

