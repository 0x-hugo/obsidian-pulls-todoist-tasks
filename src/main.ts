import { App, MarkdownView, Notice } from "obsidian";
import { ObsidianAppSettings, isSettingsMissing } from "./infrastructure/obsidian/pluginSettings";
import { createFileOperations } from "./infrastructure/obsidian/fileOperations";
import { createAppServices, hasFileParams } from "./application";

export const main = async (
    settings: ObsidianAppSettings,
    app: App,
): Promise<void> => {
    try {
        console.log("main settings: ", settings)
        const fileOps = createFileOperations(app);
        const application = createAppServices(fileOps, settings, app);
        const { filePath } = performValidations(app, settings);
        await application.downloadTasks(filePath);
        new Notice("Completed tasks loaded.");
    } catch (error) {
        console.error("Error updating tasks:", error);
        new Notice(`Error updating tasks: ${error.message}`, 10000);
    }
};

const performValidations: (app: App, settings: ObsidianAppSettings) => { filePath: string } = (app, settings) => {
    const editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    if (!editor) {
        new Notice("No active Markdown view found.", 5000);
        return;
    }

    const filePath = app.workspace.getActiveFile()?.path;

    if (!filePath) {
        new Notice("No active file found.", 5000);
        return;
    }

    const fileContent = editor.getValue();
    if (isSettingsMissing(settings) || !hasFileParams(fileContent)) {
        new Notice("No segment found in file. END and START tags are required.", 10000);
        return;
    }

    return { filePath };
}
