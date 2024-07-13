import { createTasksServices } from 'src/domain/task/taskService';
import { TodoistTask } from 'src/infrastructure/todoist';
import { FileOperations } from 'src/domain/types';

describe('taskService', () => {
  describe('upsertTasks', () => {
    it('creates sanitized filenames for tasks', async () => {
      const mockFileOps: FileOperations = {
        deleteFile: jest.fn().mockResolvedValue(undefined),
        writeFile: jest.fn().mockResolvedValue(undefined),
        readFile: jest.fn().mockResolvedValue(''),
        createFolder: jest.fn().mockResolvedValue(undefined),
      };

      const taskServices = createTasksServices(mockFileOps);

      const mockTask: TodoistTask = {
        taskId: '123456789',
        title: 'Test task: with "special" characters? (2023/24)',
        completedAt: '2023-07-15T10:00:00.000000Z',
        projectId: '987654321',
        childTasks: [],
        createdAt: '2023-07-14T09:00:00.000000Z',
        updatedAt: null,
        dueAt: '2023-07-15T00:00:00',
        isRecurring: false,
        labels: [],
        description: 'Test description',
        priority: 1,
        sectionId: '11111111',
        sectionName: 'Test Section',
        projectName: 'Test Project'
      };

      await taskServices.upsertTasks([mockTask], 'test-folder');

      expect(mockFileOps.writeFile).toHaveBeenCalledWith(
        'test-folder/123456789-Test task_ with _special_ characters_ (2023_24).md',
        expect.any(String)
      );
    });
  });
});