import { App, Notice } from "obsidian"
import { RecurringTask } from "./recurringTask";
import { AppWithPlugin } from "./task/task";

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
}