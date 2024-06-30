import moment from "moment";
import { App, MarkdownView, Notice } from "obsidian";

//internal dependencies
import { AppSettings } from "./appSettings";
import { getTimeFromKeySegments, hasStartEndSegments, isSettingsMissing } from "./constants/utils";
import { TodoistTask, fetchCompletedTasks } from "export-todoist-api";
import { renderMarkdown } from "./constants/formatTasks";

export async function main(
    settings: AppSettings,
    app: App,
): Promise<void> {
    const editor = app.workspace.getActiveViewOfType(MarkdownView).editor;
    const fileContent = editor.getValue();

    if (isSettingsMissing(settings) || !hasStartEndSegments(fileContent)) {
        new Notice("no segment found in file. END and START tags are required.", 10000);
        return;
    }

    const timeFrames: any = findTimeFramesInTag(fileContent);
    const formattedTasks: TodoistTask[] = await fetchCompletedTasks(settings.authToken, timeFrames);
    const groupedTasks: DateGroupedTasks = groupTasksByDate(formattedTasks);
    const filteredGroupedTasks: DateGroupedTasks = filterInvalidTasks(groupedTasks);

    const currentPath = app.workspace.getActiveFile().parent.path;
    Object.entries(filteredGroupedTasks).forEach(([date, tasks]) => {
        const [dailyTasks, projectTasks] = partitionArray(tasks,
            (task: TodoistTask) => {
                if (task.sectionId && !task.sectionName)
                    console.error("task.sectionId && !task.sectionName", task)
                return !task.sectionId || task.sectionName.includes('tasks')
            }
        )

        upsertAllTasks(date, projectTasks, dailyTasks, currentPath)
    });
    new Notice("Completed tasks loaded.");
}

function partitionArray<T>(array: T[], criteria: (item: T) => boolean): [T[], T[]] {
    const truePartition = array.filter(criteria);
    const falsePartition = array.filter(item => !criteria(item));
    return [truePartition, falsePartition];
}

function upsertAllTasks(date: string, projectTasks: TodoistTask[], dailyTasks: TodoistTask[], currentPath: string) {
    const [year, month, day] = date.split("-");

    const monthFolderPath = `${currentPath}/completed-tasks/${year}/${month}`;
    upsertTasks(projectTasks, monthFolderPath)

    const dailyFolderPath = `${monthFolderPath}/${year}-${month}-${day}`;
    upsertTasks(dailyTasks, dailyFolderPath)
}

function upsertTasks(
    tasks: TodoistTask[],
    folder: string,
): void {
    const encodeFilename = (str: string) => str.replace(/[\\/:*?""<>|]/g, '_')
    getOrCreateFolder(folder);
    tasks.forEach((task: TodoistTask) => {
        deleteFileTask(task, folder, encodeFilename)
        createFileTask(task, folder, encodeFilename);
    });
}

const deleteFileTask = (task: TodoistTask, folderPath: string, encodeFilename: (str: string) => string): void => {
    const fileName = `${folderPath}/${task.taskId}-${encodeFilename(task.title)}.md`
    const file = app.vault.getAbstractFileByPath(fileName)
    if (file) {
        app.vault.delete(file);
        new Notice(`File ${fileName} override.`);
    }
}

function createFileTask(task: TodoistTask, folderPath: string, encodeFilename: (str: string) => string): void {
    let markdownContent: string = renderMarkdown(task)
    const fileName = `${folderPath}/${task.taskId}-${encodeFilename(task.title)}.md`
    createFile(fileName, markdownContent);
}

const findTimeFramesInTag = (fileContent: string): any => {
    return getTimeFromKeySegments(fileContent);
}

type DateGroupedTasks = {
    //yyyy-mm-dd -> ([taskid] -> task)
    [key: string]: TodoistTask[];
}
const groupTasksByDate = (tasks: TodoistTask[]): DateGroupedTasks => {
    const map = new Map<string, TodoistTask[]>();
    const dateCriteria: (task: TodoistTask) => string = (task: TodoistTask) => {
        return task.dueAt ? task.dueAt
            : task.completedAt ? task.completedAt
                : task.createdAt;
    }
    tasks.forEach((task: TodoistTask) => {
        //utc
        const date = moment(dateCriteria(task)).utc().format("YYYY-MM-DD");
        if (!map.get(date)) {
            map.set(date, []);
        }
        map.get(date).push(task);
    });
    const groupedTasks: DateGroupedTasks = Object.fromEntries(map.entries());
    return groupedTasks;
}

const filterInvalidTasks: (groupedTasks: DateGroupedTasks) => DateGroupedTasks = (groupedTasks: DateGroupedTasks) => Object.fromEntries(
    Object.entries(groupedTasks)
        .filter(([key, _]) => key !== 'Invalid date')
        .sort(([a, _], [b, __]) => a.localeCompare(b))
);

const createFile = (filePath: string, renderedText: string) => {
    app.vault.create(filePath, renderedText).then(() => {
        new Notice(`Tasks file ${filePath} created.`);
    }).catch(err => {
        const errorMsg = `Error creating file ${filePath}: ${err.message}`
        console.error(errorMsg, err)
        new Notice(errorMsg);
    });
}
//get division by { completed-tasks/yyyy/mm/dd/taskid-taskTitle }
function getOrCreateFolder(folderPath: string) {
    const folder = app.vault.getAbstractFileByPath(folderPath)
    if (!folder) { createNewFolder(folderPath) }
}

async function createNewFolder(folderPath: string) {
    try {
        await app.vault.createFolder(folderPath);
        new Notice('Folder created successfully.');
    } catch (error) {
        const errorMsg = 'Error creating folder: ' + error.message
        console.error(errorMsg, error)
        new Notice(errorMsg);
    }
}

