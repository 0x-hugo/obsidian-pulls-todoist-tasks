interface TimeRange {
    timeStartFormattedDate: string;
    timeStartFormattedTime: string;
    timeEndFormattedDate: string;
    timeEndFormattedTime: string;
    limit: number;
}

interface TodoistTask {
    taskId: string;
    title: string;
    completedAt: string | null;
    childTasks: string[];
    projectId?: string | null;
    projectName?: string | null;
    parentId?: string | null;
    createdAt: string;
    updatedAt: string | null;
    dueAt: string | null;
    isRecurring: boolean;
    labels: string[];
    description?: string | null;
    priority: number | null;
    sectionId: string | null;
    sectionName: string | null;
}

export type { TimeRange, TodoistTask };