import { TFile } from "obsidian";
import { AppWithPlugin, IRecurringTask, TaskValidationResult } from "types";
import { validate } from "./validate";
import { toMarkdownLine } from "./toMarkdownLine";
import { parseFromMarkdownLine } from "./parseFromMarkdownLine";
import { insertRecurringTaskInFile } from "./insertRecurringTaskInFile";
import { update } from "./update";
import { save } from "./save";
import { deleteRecurringTask } from "./delete";
import { RecurringTasks } from "../recurringTasks/recurringTasks";
import { createRecurringTask } from "./createTask";

export class RecurringTask implements IRecurringTask {
  text: string = "";
  projectLink?: string;
  tags: string[] = [];
  priority?: string;
  created?: string;
  app: AppWithPlugin;
  file: TFile;

  constructor(app: AppWithPlugin) {
    this.app = app;
    this.setFile()
  }

  validate(isStrict: boolean = false, message?: string): TaskValidationResult {
    return validate.call(this, isStrict, message);
  }

  toMarkdownLine(): string {
    return toMarkdownLine.call(this);
  }

  parseFromMarkdownLine(line: string): void {
    return parseFromMarkdownLine.call(this, line);
  }

  insertRecurringTaskInFile(): Promise<void> {
    return insertRecurringTaskInFile.call(this);
  }

  update(updates: Partial<Pick<RecurringTask, 'text' | 'tags' | 'priority' | 'projectLink'>>) {
    return update.call(this, updates)
  }

  async save(): Promise<void> {
    return save.call(this)
  }

  async delete(): Promise<void> {
    return deleteRecurringTask.call(this);
  }

  static async new(app: AppWithPlugin): Promise<void> {
    return await createRecurringTask(app);
  }

  async setFile(): Promise<void> {
    if (!this.file) {
      this.file = await RecurringTasks.getFile(this.app)
    }
  }

  setCreationDate(): void {
    if (!this.created) {
        this.created = new Date().toISOString();
    }
  }
}

export const ensureInstanceOfRecurringTask = (taskInstance: any): void => {
  if (!(taskInstance instanceof RecurringTask)) throw new Error("Not instance of RecurringTask");
};