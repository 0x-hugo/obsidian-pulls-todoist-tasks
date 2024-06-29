import { App, PluginSettingTab, Setting } from "obsidian";
import TodoistCompletedTasks from "../main";

export class TodoistCompletedTasksSettingTab extends PluginSettingTab {
    plugin: TodoistCompletedTasks;

    constructor(app: App, plugin: TodoistCompletedTasks) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl("h1", { text: "Todoist Completed Tasks" });
        containerEl.createEl("a", {
            text: "Important - see usage instructions",
            href: "https://github.com/YourUsername/obsidian-task-integration",
        });

        this.addApiKeySetting(containerEl);
        this.addStartLineDetector(containerEl);
        this.addEndLineDetector(containerEl);
    }

    private addApiKeySetting(containerEl: HTMLElement) {
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
        new Setting(containerEl)
            .setName("API token")
            .setDesc(fieldDescription)
            .addText((text) =>
                text
                    .setPlaceholder("Your Todoist API token")
                    .setValue(this.plugin.settings.authToken)
                    .onChange(async (value) => {
                        this.plugin.settings.authToken = value;
                        await this.plugin.saveSettings();
                    })
            );
    }

    private addStartLineDetector(containerEl: HTMLElement) {
        new Setting(containerEl)
            .setName("Start segment")
            .setDesc("Segment for the plugin to detect the start of tasks. Supports Obsidian's comments syntax.")
            .addText((text) =>
                text
                    .setPlaceholder("%%START_TODOIST_TASKS%%")
                    .setValue(this.plugin.settings.keywordSegmentStart)
                    .onChange(async (value) => {
                        this.plugin.settings.keywordSegmentStart = value;
                        await this.plugin.saveSettings();
                    })
            );
    }

    private addEndLineDetector(containerEl: HTMLElement) {
        new Setting(containerEl)
            .setName("End segment")
            .setDesc("Segment for the plugin to detect the end of tasks. Supports Obsidian's comments syntax.")
            .addText((text) =>
                text
                    .setPlaceholder("%%END_TODOIST_TASKS%%")
                    .setValue(this.plugin.settings.keywordSegmentEnd)
                    .onChange(async (value) => {
                        this.plugin.settings.keywordSegmentEnd = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
