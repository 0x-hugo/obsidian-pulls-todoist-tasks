import { Notice, Plugin } from "obsidian";
import { ObsidianPLuginSettingsTab } from "./pluginSettings";
import { main } from "../../main";
import { DEFAULT_SETTINGS, ObsidianAppSettings } from "./pluginSettings";

export default class ObsidianPullsTodoistPlugin extends Plugin {
    settings: ObsidianAppSettings;

    async onload() {
        this.settings = await this.loadSettings();
        await this.saveSettings();
        console.log("settings in on-load: ", this.settings)

        this.addCommand({
            id: "todoist-fetch-completed-tasks",
            name: "Fetch completed tasks using dates in segments",
            callback: async () => {
                new Notice("Fetching completed tasks..");
                await main(this.settings, this.app)
            },
        });

        this.addSettingTab(new ObsidianPLuginSettingsTab(this.app, this));
    }

    async loadSettings() {
        let storedSettings: ObsidianAppSettings = (await this.loadData()) ?? DEFAULT_SETTINGS;
        console.log("loading settings from vault: ", storedSettings)
        storedSettings.settingsVersion = this.getDateAsVersion();
        return storedSettings;
    }

    async saveSettings() {
        console.log("saving settings to vault: ", this.settings)
        await this.saveData(this.settings);
    }

    private getDateAsVersion() { //get as 20240427
        const currentDate = new Date();
        const ensureTwoDigits = (number: number) => number < 10 ? `0${number}` : number;
        const year = currentDate.getFullYear();
        const month = ensureTwoDigits(currentDate.getMonth() + 1);
        const day = ensureTwoDigits(currentDate.getDate());
        const hours = ensureTwoDigits(currentDate.getHours());
        const minutes = ensureTwoDigits(currentDate.getMinutes());
        const version = Number(`${year}${month}${day}${hours}${minutes}`);
        return version;
    }
}