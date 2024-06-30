import { Notice, Plugin } from "obsidian";
import { ObsidianPLuginSettingsTab } from "./settingsTabs";
import { findTagAndUpdate } from "./components/updateFileContent";
import { DEFAULT_SETTINGS, AppSettings } from "./constants/appSettings";

export default class ObsidianPullsTodoistPlugin extends Plugin {
    settings: AppSettings;

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

        this.addSettingTab(new ObsidianPLuginSettingsTab(this.app, this));
    }
    async loadSettings() {
        let storedSettings: AppSettings = (await this.loadData()) ?? DEFAULT_SETTINGS;
        console.log("loading settings from vault: ", storedSettings)
        return storedSettings;
    }

    async saveSettings() {
        console.log("saving settings to vault: ", this.settings)
        await this.saveData(this.settings);
    }
}