import { TodoistTask } from "export-todoist-api";

export type AppSettings = {
  authToken: string;
  keywordSegmentStart: string;
  keywordSegmentEnd: string;
};

export type TimeFrame = {
  start: Date;
  end: Date;
};

export type DateGroupedTasks = {
  [key: string]: TodoistTask[];
};

export type FileOperations = {
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, content: string) => Promise<void>;
  createFolder: (folderPath: string) => Promise<void>;
  deleteFile: (filePath: string) => Promise<void>;
};

export type DomainServices = {
  findTimeFramesInFile: (fileContent: string) => TimeFrame;
  fetchCompletedTasks: (authToken: string, timeFrame: TimeFrame) => Promise<TodoistTask[]>;
  groupTasksByDate: (tasks: TodoistTask[]) => DateGroupedTasks;
  filterInvalidTasks: (groupedTasks: DateGroupedTasks) => DateGroupedTasks;
  upsertTasks: (tasks: TodoistTask[], folder: string) => Promise<void>;
};
