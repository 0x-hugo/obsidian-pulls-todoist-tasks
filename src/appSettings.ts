export interface AppSettings {
    settingsVersion: number;
    keywordSegmentStart: string;
    keywordSegmentEnd: string;
    authToken: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
    settingsVersion: 4,
    keywordSegmentStart: "%% COMPLETED_TODOIST_TASKS_START %%",
    keywordSegmentEnd: "%% COMPLETED_TODOIST_TASKS_END %%",
    authToken: "",
};
