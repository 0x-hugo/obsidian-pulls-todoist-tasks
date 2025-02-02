import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import ObsidianPullsTodoistPlugin from "./plugin";

export interface ObsidianAppSettings {
    settingsVersion: string;
    keywordSegmentStart: string;
    keywordSegmentEnd: string;
    authToken: string;
}

export const DEFAULT_SETTINGS: ObsidianAppSettings = {
    settingsVersion: "NOT_LOADED",
    keywordSegmentStart: "%% COMPLETED_TODOIST_TASKS_START %%",
    keywordSegmentEnd: "%% COMPLETED_TODOIST_TASKS_END %%",
    authToken: "NOT_FOUND_IN_",
}

export const isSettingsMissing = (settings: ObsidianAppSettings): boolean => {
    if (settings?.keywordSegmentStart === "" || settings?.keywordSegmentEnd === "") {
        new Notice("No keyword segment set. Please set one in the settings.", 10000);
        return true;
    }
    if (settings?.authToken === "") {
        new Notice("No auth token set. Please set one in the settings.", 10000);
        return true;
    }
    return false;
};

export class ObsidianPLuginSettingsTab extends PluginSettingTab {
    plugin: ObsidianPullsTodoistPlugin;

    constructor(app: App, plugin: ObsidianPullsTodoistPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        const createHeader = () => {
            containerEl.empty();
            containerEl.createEl("h1", { text: "Obsidian Pulls Todoist Tasks" });
        };

        const createInstructionsLink = () => {
            containerEl.createEl("a", {
                text: "Important - see usage instructions",
                href: "https://github.com/ivanlp10n2/obsidian-pulls-todoist-task",
            });
        };

        const createSettings = () => {
            this.addApiKeySetting(containerEl);
            this.addStartLineDetector(containerEl);
            this.addEndLineDetector(containerEl);
        };

        createHeader();
        createInstructionsLink();
        createSettings();
    }

    private addApiKeySetting(containerEl: HTMLElement) {
        createApiKeySetting(containerEl, this.plugin);
    }

    private addStartLineDetector(containerEl: HTMLElement) {
        createLineDetectorSetting(
            containerEl,
            this.plugin,
            "Start segment",
            "Segment for the plugin to detect the start of tasks. Supports Obsidian's comments syntax.",
            "%%START_TODOIST_TASKS%%",
            'keywordSegmentStart'
        );
    }

    private addEndLineDetector(containerEl: HTMLElement) {
        createLineDetectorSetting(
            containerEl,
            this.plugin,
            "End segment",
            "Segment for the plugin to detect the end of tasks. Supports Obsidian's comments syntax.",
            "%%END_TODOIST_TASKS%%",
            'keywordSegmentEnd'
        );
    }

}

const createFieldDescription = () => {
    const fieldDescription = document.createDocumentFragment();
    fieldDescription.createEl("span", null, (span) => {
        span.innerText =
            "This is your personal authentication token for Todoist. Be aware that anyone with this token " +
            "could access all of your Todoist data. This is stored in plain text in your .obsidian/plugins folder." +
            " Ensure that you are comfortable with the security implications before proceeding. " +
            '\nYou can get your token from the "API token" section ';

        span.createEl("a", null, (link) => {
            link.href = "https://todoist.com/prefs/integrations";
            link.innerText = "here.";
        });
    });
    return fieldDescription;
};

const createApiKeySetting = (containerEl: HTMLElement, plugin: ObsidianPullsTodoistPlugin) => {
    new Setting(containerEl)
        .setName("API token")
        .setDesc(createFieldDescription())
        .addText((text) =>
            text
                .setPlaceholder("Your Todoist API token")
                .setValue(plugin.settings?.authToken)
                .onChange(async (value) => {
                    const newSettings = {...plugin.settings, authToken: value};
                    console.log("adding api key: ", newSettings)
                    await plugin.saveSettings(newSettings);
                })
        );
};

const createLineDetectorSetting = (
    containerEl: HTMLElement,
    plugin: ObsidianPullsTodoistPlugin,
    name: string,
    desc: string,
    placeholder: string,
    settingKey: 'keywordSegmentStart' | 'keywordSegmentEnd'
) => {
    new Setting(containerEl)
        .setName(name)
        .setDesc(desc)
        .addText((text) =>
            text
                .setPlaceholder(placeholder)
                .setValue(plugin.settings?.[settingKey])
                .onChange(async (value) => {
                    const newSettings = {...plugin.settings, [settingKey]: value};
                    console.log("adding extra settings: ", newSettings)
                    await plugin.saveSettings(newSettings);
                })
        );
};
