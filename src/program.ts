import { App, MarkdownView, Notice } from "obsidian";
import { AppSettings, FileOperations } from "./domain/types";
import { createFileOperations } from "./domain/fileOperations";
import { isSettingsMissing, hasStartEndSegments } from "./domain/utils";
import { createDomainFunctions } from "./domain";

export const main = async (
    settings: AppSettings,
    app: App,
): Promise<void> => {
    const editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    if (!editor) {
        new Notice("No active Markdown view found.", 5000);
        return;
    }

    const fileContent = editor.getValue();
    const filePath = app.workspace.getActiveFile()?.path;

    if (!filePath) {
        new Notice("No active file found.", 5000);
        return;
    }

    if (isSettingsMissing(settings) || !hasStartEndSegments(fileContent)) {
        new Notice("No segment found in file. END and START tags are required.", 10000);
        return;
    }

    const fileOps: FileOperations = createFileOperations(app);
    const { downloadTasksFromFileParams: downloadTasksFromFileParams } = createDomainFunctions(fileOps);

    try {
        await downloadTasksFromFileParams(filePath, settings, app);
        new Notice("Completed tasks loaded.");
    } catch (error) {
        console.error("Error updating tasks:", error);
        new Notice(`Error updating tasks: ${error.message}`, 10000);
    }
};
