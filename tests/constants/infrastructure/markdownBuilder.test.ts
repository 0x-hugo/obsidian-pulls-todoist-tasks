import { buildMarkdown } from '../../../src/infrastructure/obsidian/markdownBuilder';
import { TodoistTask } from 'src/infrastructure/todoist';

describe("markdown builder", () => {
	it("render single task", () => {
		const result = buildMarkdown(data.singleInput)
		expect(result).toEqual(data.singleOutput);
	})
})

const data: { singleInput: TodoistTask, singleOutput: string } = {
	singleInput:
		{
			"taskId": "6960733805",
			"title": "mandar msj para ver a mariel por el diente sensible",
			"completedAt": "2023-06-14T15:02:37.000000Z",
			"projectId": "1777918547",
			"childTasks": [],
			"createdAt": "2023-06-13T02:06:05.175619Z",
			"updatedAt": null,
			"dueAt": "2023-06-14T13:00:00",
			"isRecurring": true,
			"labels": ["asdb"],
			description: `
- what should I do with computers?

- do I host server?

	- If so, who would share the house with?

	- mmm`,
			priority: 1,
			sectionId: '117184028',
			sectionName: 'Better me',
			projectName: 'Inbox'
		} as TodoistTask,
	singleOutput:
		`---
date: 2023-06-14T13:00:00
todoist_is_completed: true
todoist_is_recurring: true
todoist_created_at: 2023-06-13T02:06:05.175619Z
todoist_updated_at: null
todoist_task_id: 6960733805
todoist_priority: 1
todoist_project_id: 1777918547
todoist_section_id: 117184028
todoist_project_name: Inbox
todoist_section_name: Better me
todoist_completed_at: 2023-06-14T15:02:37.000000Z
todoist_parent_id: null
todoist_labels: asdb
todoist_status: done
tags: [todoist, todoist-project-Inbox, todoist-section-Better-me, todoist-status-done]
---

## mandar msj para ver a mariel por el diente sensible
### Description

- what should I do with computers?

- do I host server?

	- If so, who would share the house with?

	- mmm

### Subtasks

### Href
App: https://app.todoist.com/app/task/mandar-msj-para-ver-a-mariel-por-el-diente-sensible-6960733805
Api: https://api.todoist.com/sync/v9/items/get?item_id=6960733805`

}

