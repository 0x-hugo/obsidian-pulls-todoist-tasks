import { TodoistTask } from "src/infrastructure/todoist";
import { App, Notice } from "obsidian";
import { AppSettings, DateGroupedTasks, FileOperations, TaskServices } from "../../domain/types";

export const downloadTasksFromFileParams = (
  taskServices: TaskServices,
  fileOps: FileOperations,
  settings: AppSettings,
  app: App
) =>
  async (filePath: string): Promise<void> => {
    const downloadTasks = saveTasksToFolders(taskServices, fileOps);
    const fileContent = await fileOps.readFile(filePath);
    const fileParams = taskServices.findTimeFramesInFile(fileContent);
    const tasks = await taskServices.fetchCompletedTasks(settings.authToken, fileParams);
    const groupedTasks = taskServices.groupTasksByDate(tasks);
    const filteredGroupedTasks: DateGroupedTasks = taskServices.filterInvalidTasks(groupedTasks);

    const currentPath = app.workspace.getActiveFile()?.parent?.path ?? '';

    await downloadTasks(filteredGroupedTasks, currentPath);

    new Notice("Completed tasks loaded.");
  };

const saveTasksToFolders = (taskServices: TaskServices, fileOps: FileOperations) =>
  async (groupedTasks: DateGroupedTasks, currentPath: string) =>
    Promise.all(
      Object.entries(groupedTasks).map(([date, tasks]: [string, TodoistTask[]]) =>
        processTaskGroup(taskServices, fileOps)(currentPath, [date, tasks]))
    );

const partitionTasks = (tasks: TodoistTask[]): [TodoistTask[], TodoistTask[]] => {
  const isDailyTask = (task: TodoistTask) => !task.sectionId || task.sectionName?.includes('tasks');
  return [
    tasks.filter(isDailyTask),
    tasks.filter(task => !isDailyTask(task))
  ];
};

const processTaskGroup = (taskServices: TaskServices, fileOps: FileOperations) =>
  async (currentPath: string, [date, tasks]: [string, TodoistTask[]]) => {
    const [year, month, day] = date.split("-");
    const monthFolderPath = `${currentPath}/completed-tasks/${year}/${month}`;
    const dailyFolderPath = `${monthFolderPath}/${year}-${month}-${day}`;

    const [dailyTasks, projectTasks] = partitionTasks(tasks);

    await Promise.all([
      fileOps.createFolder(monthFolderPath),
      fileOps.createFolder(dailyFolderPath),
      taskServices.upsertTasks(projectTasks, monthFolderPath),
      taskServices.upsertTasks(dailyTasks, dailyFolderPath)
    ]);
  };

