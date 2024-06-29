import { Notice, Plugin } from "obsidian";
import { TodoistCompletedTasksSettingTab } from "./components/settingsTabs";
import { findTagAndUpdate } from "./components/updateFileContent";
import { DEFAULT_SETTINGS, TodoistSettings } from "./constants/DefaultSettings";

export default class TodoistCompletedTasks extends Plugin {
    settings: TodoistSettings;

    async onload() {
        this.settings = await this.loadSettings();
        await this.saveSettings();
        console.log("settings in on-load: ", this.settings)

        this.addCommand({
            id: "todoist-fetch-completed-tasks",
            name: "Fetch completed tasks using dates in segments",
            callback: async () => {
                new Notice("Fetching completed tasks..");
                await findTagAndUpdate(this.settings, this.app)
            },
        });

        this.addSettingTab(new TodoistCompletedTasksSettingTab(this.app, this));
    }
    async loadSettings() {
        let storedSettings: TodoistSettings = (await this.loadData()) ?? DEFAULT_SETTINGS;
        console.log("loading settings from vault: ", storedSettings)
        return storedSettings;
    }

    async saveSettings() {
        console.log("saving settings to vault: ", this.settings)
        await this.saveData(this.settings);
    }

    // async saveSettings(settings: TodoistSettings) {
    //     await this.saveData(settings);
    //     this.settings = settings;
    //     console.log("settings in saveSettings: ", this.settings)
    //     return this.settings;
    // }
}