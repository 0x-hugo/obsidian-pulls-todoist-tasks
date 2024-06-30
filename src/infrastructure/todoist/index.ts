
export interface TimeRange {
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

export interface TodoistAPI {
    fetchCompletedTasks: (authToken: string, timeFrames: TimeRange) => Promise<TodoistTask[]>;
}

export function fetchCompletedTasks(authToken: string, timeFrames: TimeRange): Promise<TodoistTask[]> {
    const api = new MockTodoistAPI();
    return api.fetchCompletedTasks(authToken, timeFrames);
}

class EmptyTodoistAPI implements TodoistAPI {
    fetchCompletedTasks(authToken: string, timeFrames: TimeRange): Promise<TodoistTask[]> {
        return Promise.resolve([]);
    }
} 

class MockTodoistAPI implements TodoistAPI {
    fetchCompletedTasks(authToken: string, timeFrames: TimeRange): Promise<TodoistTask[]> {
        const json: TodoistTask[] = JSON.parse(this.json);
        return Promise.resolve(json);
    }

    private json = `[
        {
            "taskId": "6930677875",
            "title": "Lavar la ropa para mañana",
            "completedAt": "2023-06-02T00:10:44.888000Z",
            "projectId": "1777918547",
            "projectName": "Inbox",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-06-01T23:54:55.241864Z",
            "updatedAt": null,
            "dueAt": "2023-06-01T21:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 2,
            "sectionId": null,
            "sectionName": ""
        },
        {
            "taskId": "6920689124",
            "title": "Terminar el test del trabajo",
            "completedAt": "2023-06-01T22:37:59.439945Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-30T00:52:42.116386Z",
            "updatedAt": null,
            "dueAt": "2023-06-01T08:35:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117183996",
            "sectionName": "work tasks"
        },
        {
            "taskId": "6927679763",
            "title": "Mandarle mensaje a andre por los aparatos",
            "completedAt": "2023-06-01T13:39:57.999000Z",
            "projectId": "1777918547",
            "projectName": "Inbox",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-06-01T02:58:17.960408Z",
            "updatedAt": null,
            "dueAt": "2023-06-01T11:30:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": null,
            "sectionName": ""
        },
        {
            "taskId": "6898041439",
            "title": "Ultra-Processed People",
            "completedAt": "2023-06-01T00:45:41.539696Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": "6841094332",
            "childTasks": [],
            "createdAt": "2023-05-22T01:41:43.311988Z",
            "updatedAt": null,
            "dueAt": null,
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "117183947",
            "sectionName": "Better me"
        },
        {
            "taskId": "6927487236",
            "title": "Terminar el audiolibro de UPP",
            "completedAt": "2023-06-01T00:45:28.485000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-06-01T00:38:46.054333Z",
            "updatedAt": null,
            "dueAt": "2023-05-31",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117183953",
            "sectionName": "better me tasks"
        },
        {
            "taskId": "6927379401",
            "title": "Lavar la ropa para mañana",
            "completedAt": "2023-06-01T00:08:15.448000Z",
            "projectId": "1777918547",
            "projectName": "Inbox",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-31T23:23:59.623500Z",
            "updatedAt": null,
            "dueAt": "2023-05-31T22:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": null,
            "sectionName": ""
        },
        {
            "taskId": "6924293811",
            "title": "mandarles msj a la casa de cambio",
            "completedAt": "2023-05-31T11:30:16.568000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-31T02:06:57.606704Z",
            "updatedAt": null,
            "dueAt": "2023-05-31T09:30:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117183974",
            "sectionName": "money and networking tasks"
        },
        {
            "taskId": "6920071239",
            "title": "Lavar la ropa del gym para mañana",
            "completedAt": "2023-05-30T00:49:16.098000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-29T19:03:31.784456Z",
            "updatedAt": null,
            "dueAt": "2023-05-29T22:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117184003",
            "sectionName": "material tasks"
        },
        {
            "taskId": "6919294025",
            "title": "Sacar la basura",
            "completedAt": "2023-05-29T23:33:57.047000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-29T13:59:37.551215Z",
            "updatedAt": null,
            "dueAt": "2023-05-29T18:30:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117184003",
            "sectionName": "material tasks"
        },
        {
            "taskId": "6917841350",
            "title": "documentar info sobre AWS codewhispered",
            "completedAt": "2023-05-29T22:47:50.860000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-29T01:52:22.429981Z",
            "updatedAt": null,
            "dueAt": "2023-05-29T14:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117183996",
            "sectionName": "work tasks"
        },
        {
            "taskId": "6920094789",
            "title": "Resolver el tema del candado",
            "completedAt": "2023-05-29T19:14:13.320097Z",
            "projectId": "1777918547",
            "projectName": "Inbox",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-29T19:14:12.529296Z",
            "updatedAt": null,
            "dueAt": "2023-05-29",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": null,
            "sectionName": ""
        },
        {
            "taskId": "6841124029",
            "title": "Recordarle al facu dar de baja el linkedin",
            "completedAt": "2023-05-29T13:23:05.505000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-02T03:45:58.523016Z",
            "updatedAt": null,
            "dueAt": "2023-05-29",
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "117183974",
            "sectionName": "money and networking tasks"
        },
        {
            "taskId": "6841119029",
            "title": "Check tasks 4 week",
            "completedAt": "2023-05-29T01:56:57.132000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": "6841115479",
            "childTasks": [],
            "createdAt": "2023-05-02T03:42:32.749458Z",
            "updatedAt": null,
            "dueAt": "2023-05-28",
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "117183947",
            "sectionName": "Better me"
        },
        {
            "taskId": "6868152840",
            "title": "Mandarlr msj a toto para juntarnos los 3",
            "completedAt": "2023-05-29T01:52:39.032816Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-11T02:10:53.292087Z",
            "updatedAt": null,
            "dueAt": null,
            "isRecurring": false,
            "labels": [],
            "priority": 2,
            "sectionId": "122528373",
            "sectionName": "Friends and Family"
        },
        {
            "taskId": "6844551059",
            "title": "Juntarme con vampi",
            "completedAt": "2023-05-29T01:52:32.681517Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-03T01:43:51.754954Z",
            "updatedAt": null,
            "dueAt": null,
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "122528373",
            "sectionName": "Friends and Family"
        },
        {
            "taskId": "6898082561",
            "title": "Complete _May month",
            "completedAt": "2023-05-29T01:49:48.009494Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": "6841105886",
            "childTasks": [],
            "createdAt": "2023-05-22T02:09:25.160565Z",
            "updatedAt": null,
            "dueAt": null,
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "117183961",
            "sectionName": "Money and networking"
        },
        {
            "taskId": "6898058993",
            "title": "Check more habits you can add",
            "completedAt": "2023-05-29T01:46:58.020462Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": "6876083667",
            "childTasks": [],
            "createdAt": "2023-05-22T01:53:54.201263Z",
            "updatedAt": null,
            "dueAt": null,
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "123555608",
            "sectionName": "Entrepreneur"
        },
        {
            "taskId": "6917765156",
            "title": "Lavar ropa para mañana el gym",
            "completedAt": "2023-05-29T01:01:02.915000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-29T00:51:47.815841Z",
            "updatedAt": null,
            "dueAt": "2023-05-28T22:15:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117184003",
            "sectionName": "material tasks"
        },
        {
            "taskId": "6915250355",
            "title": "Ir a la casa de la madrina",
            "completedAt": "2023-05-28T17:47:12.382000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-27T15:21:46.168894Z",
            "updatedAt": null,
            "dueAt": "2023-05-28T12:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "122528379",
            "sectionName": "friends and family tasks"
        },
        {
            "taskId": "6898140280",
            "title": "mandarle msj al toto a ver si va a estar el domingo",
            "completedAt": "2023-05-27T15:21:54.389000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-22T02:47:37.463115Z",
            "updatedAt": null,
            "dueAt": "2023-05-27T19:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "122528379",
            "sectionName": "friends and family tasks"
        },
        {
            "taskId": "6914319149",
            "title": "Ir a visitar a vampi",
            "completedAt": "2023-05-27T15:20:31.934000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-27T05:30:16.159822Z",
            "updatedAt": null,
            "dueAt": "2023-05-27T11:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "122528379",
            "sectionName": "friends and family tasks"
        },
        {
            "taskId": "6885360249",
            "title": "averiguar por una fonoaudiologa",
            "completedAt": "2023-05-27T15:14:04.685000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-17T02:23:46.124503Z",
            "updatedAt": null,
            "dueAt": "2023-05-27T10:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 1,
            "sectionId": "117183953",
            "sectionName": "better me tasks"
        },
        {
            "taskId": "6898104425",
            "title": "Agregar habitos a los que ya tengo de todoist si hacen falta",
            "completedAt": "2023-05-27T06:33:54.067000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-22T02:23:34.366244Z",
            "updatedAt": null,
            "dueAt": "2023-05-26T11:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "123557003",
            "sectionName": "entrepreneur tasks"
        },
        {
            "taskId": "6898103720",
            "title": "Agregar gastos de Mayo que me quedan pendientes",
            "completedAt": "2023-05-25T16:05:59.339000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-22T02:23:00.221645Z",
            "updatedAt": null,
            "dueAt": "2023-05-25T11:00:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117183974",
            "sectionName": "money and networking tasks"
        },
        {
            "taskId": "6909912829",
            "title": "Llevarle la ropa a vieja y al lavadero",
            "completedAt": "2023-05-25T15:46:11.554000Z",
            "projectId": "2308886649",
            "projectName": "May 2023",
            "parentId": null,
            "childTasks": [],
            "createdAt": "2023-05-25T14:44:54.982158Z",
            "updatedAt": null,
            "dueAt": "2023-05-25T12:45:00",
            "isRecurring": false,
            "labels": [],
            "priority": 4,
            "sectionId": "117184003",
            "sectionName": "material tasks"
        }
    ]
    `
}