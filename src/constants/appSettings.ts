export interface AppSettings {
    settingsVersion: number;
    keywordSegmentStart: string;
    keywordSegmentEnd: string;
    authToken: string;
    taskPrefix: string;
    taskPostfix: string;
    renderSubtasks: boolean;
    renderProjectsHeaders: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
    settingsVersion: 4,
    keywordSegmentStart: "%% COMPLETED_TODOIST_TASKS_START %%",
    keywordSegmentEnd: "%% COMPLETED_TODOIST_TASKS_END %%",
    authToken: "",
    taskPrefix: "*",
    taskPostfix: "",
    renderSubtasks: true,
    renderProjectsHeaders: true,
};
