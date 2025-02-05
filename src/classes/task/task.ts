import { TFile } from "obsidian";
import { AppWithPlugin } from "types";
import { ITask, TaskStatus, TaskValidationResult } from "types";
import { validate as validateFn } from "./validate";
import { parseFromMarkdownLine as parseFromMarkdownLineFn } from "./parseFromMarkdownLine";
import { toMarkdownLine as toMarkdownLineFn } from "./toMarkdownLine";
import { insertTaskInFile as insertTaskInFileFn } from "./insertTaskInFile";
import { compareTo } from "./compareTo";
import { createTask } from "./new/new";
import { Tasks } from "../tasks/tasks";

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
    return validateFn.call(this, isStrict, message);
  }

  toMarkdownLine(): string {
    return toMarkdownLineFn.call(this);
  }

  parseFromMarkdownLine(line: string): void {
    return parseFromMarkdownLineFn.call(this, line);
  }

  insertTaskInFile(): Promise<void> {
    return insertTaskInFileFn.call(this);
  }

  compareTo(other: Task): number {
    return compareTo.call(this, other);
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

  setProjectLink(path: string): void {
    if (/^\[\[[^\[\]]+\.md\]\]$/.test(path)) {
      this.projectLink = path;
    } else {
      this.projectLink = `[[${path.replace(/\.md$/, '')}.md]]`;
    }
  }
}

export const ensureInstanceOfTask = (taskInstance: any): void => {
    if (!(taskInstance instanceof Task)) throw new Error("Not instance of Task");
};