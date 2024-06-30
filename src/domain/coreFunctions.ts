import moment from "moment";

//internal
import { TimeFrames, TodoistTask, fetchCompletedTasks as fetchTodoistTasks } from "export-todoist-api";
import { renderMarkdown as renderTaskMarkdown } from "../constants/formatTasks";
import { getTimeFromKeySegments } from "../constants/utils";
import { CoreFunctions, DateGroupedTasks, TimeFrame, FileOperations } from "./types";

export const createCoreFunctions = (fileOps: FileOperations): CoreFunctions => ({
  findTimeFramesInTag: (fileContent: string) => getTimeFromKeySegments(fileContent),

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

  renderMarkdown: renderTaskMarkdown,

  upsertTasks: async (
    tasks: TodoistTask[],
    folder: string
  ): Promise<void> => {
    const encodeFilename = (str: string) => str.replace(/[\\/:*?""<>|]/g, '_');
    const createTaskFile = async (task: TodoistTask) => {
      const fileName = `${folder}/${task.taskId}-${encodeFilename(task.title)}.md`;
      await fileOps.deleteFile(fileName).catch(() => { });
      const markdownContent = renderTaskMarkdown(task);
      await fileOps.writeFile(fileName, markdownContent);
    };

    await Promise.all(tasks.map(createTaskFile));
  },
});