export interface TodoistAPI {
    fetchCompletedTasks: (authToken: string, timeFrames: TimeFrames) => Promise<TodoistTask[]>;
}

export function fetchCompletedTasks(authToken: string, timeFrames: TimeFrames): Promise<TodoistTask[]> {
    // Create an EmptyTodoistAPI class that implements the TodoistAPI interface
    class EmptyTodoistAPI implements TodoistAPI {
        fetchCompletedTasks(authToken: string, timeFrames: TimeFrames): Promise<TodoistTask[]> {
            return Promise.resolve([]);
        }
    }

    // Create an instance of EmptyTodoistAPI and use it to fetch tasks
    const api = new EmptyTodoistAPI();
    return api.fetchCompletedTasks(authToken, timeFrames);
}

export interface TimeFrames {
    timeStartFormattedDate: string;
    timeStartFormattedTime: string;
    timeEndFormattedDate: string;
    timeEndFormattedTime: string;
    limit: number;
}

export interface TodoistTask {
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