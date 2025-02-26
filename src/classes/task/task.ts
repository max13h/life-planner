import { TFile } from "obsidian";
import { AppWithPlugin, ITask, TaskPriorities, TaskStatus, TaskValidationResult } from "types";
import { compareTo } from "./compareTo";
import { Tasks } from "../tasks/tasks";
import { createTask } from "./createTask";
import { parseFromMarkdownLine } from "../utils/parseFromMarkdownLine";
import { toMarkdownLine } from "../utils/toMarkdownLine";
import { validate } from "../utils/validate";
import { insertTaskInFile } from "../utils/insertTaskInFile";
import { update } from "../utils/update";
import { save } from "../utils/save";
import { deleteTaskOrRecurringTask } from "../utils/delete";
import { duplicateTask } from "./duplicate";
import { generateId } from "src/utils/id";

export default class Task implements ITask {
  status: TaskStatus = " ";
  text: string = "";
  schedule?: string;
  start?: string;
  end?: string;
  occurrence?: string;
  projectLink?: string;
  tags: string[] = [];
  priority?: TaskPriorities;
  created?: string;
  completed?: string;
  app: AppWithPlugin;
  file: TFile;
  id: string;

  constructor(app: AppWithPlugin) {
    this.app = app;
    this.setFile()
    this.id = generateId()
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

  insertTaskInFile(): Promise<void> {
    return insertTaskInFile(this);
  }

  compareTo(other: Task): number {
    return compareTo(this, other);
  }

  update(updates: Partial<Pick<Task, 'status' | 'text' | 'tags' | 'priority' | 'schedule' | 'start' | 'end' | 'occurrence' | 'projectLink'>>) {
    return update(this, updates)
  }

  async save(): Promise<void> {
    return save(this)
  }

  async delete(): Promise<void> {
    return deleteTaskOrRecurringTask(this);
  }

  static async new(app: AppWithPlugin): Promise<void> {
    return await createTask(app);
  }

  async duplicate(): Promise<void> {
    return duplicateTask(this.app, this)
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