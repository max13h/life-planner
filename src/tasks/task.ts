import {  TFile } from "obsidian";
import { AppWithPlugin } from "types";
import { ITask, TaskStatus, TaskValidationResult } from "types";
import { TaskParseError, TaskValidationError } from "errors";
import { Tasks } from "./tasks";
import { TaskFileError } from "errors";

export class Task implements ITask {
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
  file?: TFile;

  private static readonly TABLE_HEADER = "|Status|Text|Schedule|Start|End|Occurrence|Project Link|Tags|Priority|Recurs|Created|Completed|\n|------|-----|--------|-----|---|----------|-------------|----|--------|-------|--------|---------|";

  constructor(app: AppWithPlugin) {
    this.app = app;
  }

  parseFromMarkdownLine(line: string): void {
    const cleanLine = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    const columns = cleanLine.split("|").map((col) => col.trim());

    if (columns.length !== 12) {
      throw new TaskParseError("The task line does not have the correct number of columns.");
    }

    try {
      this.status = columns[0] as TaskStatus || " ";
      this.text = columns[1];
      this.schedule = columns[2] || undefined;
      this.start = columns[3] || undefined;
      this.end = columns[4] || undefined;
      this.occurrence = columns[5] || undefined;
      this.projectLink = columns[6] ? columns[6].replace(/\[\[(.*?)\]\]/, "$1") : undefined;
      this.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
      this.priority = columns[8] || undefined;
      this.recurs = columns[9] || undefined;
      this.created = columns[10] || undefined;
      this.completed = columns[11] || undefined;
    } catch (error) {
      throw new TaskParseError(`Failed to parse task line: ${error.message}`);
    }
  }

  validate(): TaskValidationResult {
    const errors: string[] = [];

    if (!this.text.trim()) {
      errors.push("Task text is required");
    }

    if (this.tags.some(tag => !tag.startsWith("#"))) {
      errors.push("All tags must start with #");
    }

    if (this.priority && !["low", "medium", "high"].includes(this.priority)) {
      errors.push("Priority must be low, medium, or high");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toMarkdownLine(): string {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new TaskValidationError(`Invalid task: ${validation.errors.join(", ")}`);
    }

    const tagsString = this.tags.join(" ");
    const projectLinkFormatted = this.projectLink ? `[[${this.projectLink}]]` : "";

    return `|${this.status}|${this.text}|${this.schedule || ""}|${this.start || ""}|${
      this.end || ""}|${this.occurrence || ""}|${projectLinkFormatted}|${tagsString}|${
      this.priority || ""}|${this.recurs || ""}|${this.created || ""}|${this.completed || ""}|`;
  }

  async insertTaskInFile(): Promise<void> {
    if (!this.created) {
      this.created = new Date().toISOString();
    }

    const validation = this.validate();
    if (!validation.isValid) {
      throw new TaskValidationError(`Cannot insert invalid task: ${validation.errors.join(", ")}`);
    }

    this.file = await this.ensureExistAndReturnFile();
    await this.app.vault.append(this.file, `\n${this.toMarkdownLine()}`);
  }

  private async ensureExistAndReturnFile(): Promise<TFile> {
    const { filePathFormatted, folderPath } = Tasks.retrieveFilePath(this.app);

    try {
      await this.app.vault.createFolder(folderPath);
    } catch (error) {
      if (!error.message.includes("Folder already exists")) throw error;
    }

    try {
      await this.app.vault.create(filePathFormatted, Task.TABLE_HEADER);
    } catch (error) {
      if (!error.message.includes("File already exists")) throw error;
    }

    const file = this.app.vault.getFileByPath(filePathFormatted);
    if (!file) throw new TaskFileError("Failed to create or find task file");

    return file;
  }

  // Comparison methods
  compareTo(other: Task): number {
    // Default comparison by date, then priority
    if (this.schedule && other.schedule) {
      const dateComparison = this.schedule.localeCompare(other.schedule);
      if (dateComparison !== 0) return dateComparison;
    }

    const priorityValues: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
    const thisPriority = this.priority && this.priority in priorityValues ? priorityValues[this.priority] : 0;
    const otherPriority = other.priority && other.priority in priorityValues ? priorityValues[other.priority] : 0;
    
    return otherPriority - thisPriority;
  }
} 