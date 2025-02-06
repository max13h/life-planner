import { TFile } from "obsidian";
import { AppWithPlugin } from "types";
import { ITask, TaskStatus, TaskValidationResult } from "types";
import { validate } from "./validate";
import { parseFromMarkdownLine } from "./parseFromMarkdownLine";
import { toMarkdownLine } from "./toMarkdownLine";
import { insertTaskInFile } from "./insertTaskInFile";
import { compareTo } from "./compareTo";
import { createTask } from "./new/new";
import { Tasks } from "../tasks/tasks";
import { update } from "./update";
import { save } from "./save";
import { deleteTask } from "./delete";

export default class Task implements ITask {
  status: TaskStatus = " ";
  text: string = "";
  schedule?: string;
  start?: string;
  end?: string;
  occurrence?: string;
  projectLink?: string;
  tags: string[] = [];
  priority?: string;
  recurs?: string;
  created?: string;
  completed?: string;
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

  insertTaskInFile(): Promise<void> {
    return insertTaskInFile.call(this);
  }

  compareTo(other: Task): number {
    return compareTo.call(this, other);
  }

  update(updates: Partial<Pick<Task, 'status' | 'text' | 'tags' | 'priority' | 'schedule' | 'start' | 'end' | 'occurrence' | 'projectLink' | 'recurs'>>) {
    return update.call(this, updates)
  }

  async save(): Promise<void> {
    return save.call(this)
  }

  async delete(): Promise<void> {
    return deleteTask.call(this);
  }

  static async new(app: AppWithPlugin): Promise<void> {
    return await createTask(app);
  }

  async setFile(): Promise<void> {
    if (!this.file) {
      this.file = await Tasks.getFile(this.app)
    }
  }

  setCreationDate(): void {
    if (!this.created) {
        this.created = new Date().toISOString();
    }
  }
}

export const ensureInstanceOfTask = (taskInstance: any): void => {
    if (!(taskInstance instanceof Task)) throw new Error("Not instance of Task");
};