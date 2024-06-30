import { App, Notice, TFile } from "obsidian";
import { FileOperations } from "src/application/";

const createNotice = (message: string) => new Notice(message);

export const createFileOperations = (app: App): FileOperations => ({
  readFile: async (filePath: string) => {
    const file = app.vault.getAbstractFileByPath(filePath) as TFile;
    if (!file) throw new Error(`File not found: ${filePath}`);
    return await app.vault.read(file);
  },

  writeFile: async (filePath: string, content: string) => {
    await app.vault.create(filePath, content);
    createNotice(`File ${filePath} created.`);
  },

  createFolder: async (folderPath: string) => {
    try {
      await app.vault.createFolder(folderPath);
      createNotice('Folder created successfully.');
    } catch (error) {
      const errorMsg = `Error creating folder: ${error.message}`;
      console.error(errorMsg, error);
      createNotice(errorMsg);
    }
  },

  deleteFile: async (filePath: string) => {
    const file = app.vault.getAbstractFileByPath(filePath);
    if (file) {
      await app.vault.delete(file);
      createNotice(`File ${filePath} deleted.`);
    }
  }
});
