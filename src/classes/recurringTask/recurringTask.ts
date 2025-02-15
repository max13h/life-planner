import { TFile } from "obsidian";
import { AppWithPlugin, IRecurringTask, TaskValidationResult } from "types";
import { RecurringTasks } from "../recurringTasks/recurringTasks";
import { createRecurringTask } from "./createTask";
import { parseFromMarkdownLine } from "../utils/parseFromMarkdownLine";
import { toMarkdownLine } from "../utils/toMarkdownLine";
import { validate } from "../utils/validate";
import { insertTaskInFile } from "../utils/insertTaskInFile";
import { update } from "../utils/update";
import { save } from "../utils/save";
import { deleteTaskOrRecurringTask } from "../utils/delete";

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
    return validate(this, isStrict, message);
  }

  toMarkdownLine(): string {
    return toMarkdownLine(this)
  }

  parseFromMarkdownLine(line: string): void {
    return parseFromMarkdownLine(line, this)
  }

  insertRecurringTaskInFile(): Promise<void> {
    return insertTaskInFile(this);
  }

  update(updates: Partial<Pick<RecurringTask, 'text' | 'tags' | 'priority' | 'projectLink'>>) {
    return update(this, updates)
  }

  async save(): Promise<void> {
    return save(this)
  }

  async delete(): Promise<void> {
    return deleteTaskOrRecurringTask.call(this);
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