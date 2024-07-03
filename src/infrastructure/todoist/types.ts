import { TodoistTaskV1 } from 'todoist-api';

interface TimeRange {
    timeStartFormattedDate: string;
    timeStartFormattedTime: string;
    timeEndFormattedDate: string;
    timeEndFormattedTime: string;
    limit: number;
}

export type TodoistTask = TodoistTaskV1

export type { TimeRange } 