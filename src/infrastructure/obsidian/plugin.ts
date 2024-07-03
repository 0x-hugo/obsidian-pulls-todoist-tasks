import { Notice, Plugin } from "obsidian";
import { main } from "../../main";
import { DEFAULT_SETTINGS, ObsidianAppSettings, ObsidianPLuginSettingsTab } from "./pluginSettings";

export default class ObsidianPullsTodoistPlugin extends Plugin {
    settings: ObsidianAppSettings;

    async onload() {
        const settings = await this.loadSettings();
        console.log("ObsidianPullsTodoistPlugin loading: ", settings)
        await this.saveSettings(settings);

        this.addCommand({
            id: "todoist-fetch-completed-tasks",
            name: "Fetch completed tasks using dates in segments",
            callback: async () => {
                new Notice("Fetching completed tasks..");
                await main(this.settings, this.app)
                new Notice("Completed tasks fetched");
            },
        });

        this.addSettingTab(new ObsidianPLuginSettingsTab(this.app, this));
    }

    async loadSettings() {
        let storedSettings = await this.loadData()
        storedSettings.settingsVersion = await this.getVersionFromManifest(this);
        const mergedSettings = {...DEFAULT_SETTINGS, ...storedSettings};
        return mergedSettings;
    }

    async saveSettings(settings: any) {
        console.log("about to save settings: ", settings)
        await this.saveData(settings);
    }

    private getVersionFromManifest = async (plugin: ObsidianPullsTodoistPlugin): Promise<string> => {
        try {
            const manifest: string = await plugin.app.vault.adapter.read(
                `${plugin.manifest.dir}/manifest.json`
            );
            const manifestJson = JSON.parse(manifest);
            return manifestJson.version;
        } catch (error) {
            console.error("Error reading manifest.json:", error);
            throw error
        }
    };

}