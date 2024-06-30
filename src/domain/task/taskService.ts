import moment from "moment";

//internal
import { TodoistTask, fetchCompletedTasks as fetchTodoistTasks } from "src/infrastructure/todoist";
import { buildMarkdown } from "../../infrastructure/obsidian/markdownBuilder";
import { extractTimeRangeFromFile } from "../timeframe/timeframeExtractor";
import { DateGroupedTasks, TaskServices, FileOperations, TimeFrame } from "../types";

export const createTasksServices = (fileOps: FileOperations): TaskServices => ({
  findTimeFramesInFile: (fileContent: string) => extractTimeRangeFromFile(fileContent),

  fetchCompletedTasks: async (authToken: string, timeFrame: TimeFrame): Promise<TodoistTask[]> =>
    fetchTodoistTasks(authToken, null),

  groupTasksByDate: (tasks: TodoistTask[]): DateGroupedTasks =>
    tasks.reduce((acc, task) => {
      const date = moment(task.dueAt || task.completedAt || task.createdAt).utc().format("YYYY-MM-DD");
      return { ...acc, [date]: [...(acc[date] || []), task] };
    }, {} as DateGroupedTasks),

  filterInvalidTasks: (groupedTasks: DateGroupedTasks): DateGroupedTasks =>
    Object.fromEntries(
      Object.entries(groupedTasks)
        .filter(([key, _]) => key !== 'Invalid date')
        .sort(([a, _], [b, __]) => a.localeCompare(b))
    ),

  upsertTasks: async (
    tasks: TodoistTask[],
    folder: string
  ): Promise<void> => {
    const encodeFilename = (str: string) => str.replace(/[\\/:*?""<>|]/g, '_');
    const createTaskFile = async (task: TodoistTask) => {
      const fileName = `${folder}/${task.taskId}-${encodeFilename(task.title)}.md`;
      await fileOps.deleteFile(fileName).catch(() => { });
      const markdownContent = buildMarkdown(task);
      await fileOps.writeFile(fileName, markdownContent);
    };

    await Promise.all(tasks.map(createTaskFile));
  },
});