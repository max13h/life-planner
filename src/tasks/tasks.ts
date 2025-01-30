import { App, Notice } from "obsidian"
import { RecurringTask } from "./recurringTask";
import { AppWithPlugin } from "types";

export class Tasks {
  protected app: App;
  static app: AppWithPlugin;

  constructor(app: App) {
    this.app = app
  }

  static async getRecurringTasks(app: App) {
    const { filePathFormatted } = RecurringTask.retrieveFilePath(app as AppWithPlugin)

    const file = app.vault.getFileByPath(filePathFormatted)
    if (!file) return []

    const fileContent = await app.vault.read(file);
    const lines = fileContent.split("\n");
    const tasksLines = lines.slice(2);
    console.log(tasksLines);
  }

  static retrieveFilePath(app: AppWithPlugin) {
    const settings = app.plugins.plugins["life-planner"].settings;

    const folderPath = settings.tasksFolder.endsWith('/') ? settings.tasksFolder : settings.tasksFolder + '/';
    const fileName = settings.tasksFile.startsWith('/') ? settings.tasksFile.slice(1) : settings.tasksFile;
    const filePathFormatted = folderPath + fileName + ".md";

    return { folderPath, fileName, filePathFormatted }
  }
}