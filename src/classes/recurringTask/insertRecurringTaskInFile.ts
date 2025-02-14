import { Notice } from "obsidian";
import { ensureInstanceOfRecurringTask, RecurringTask } from "./recurringTask";

export async function insertRecurringTaskInFile(this: RecurringTask): Promise<void> {
  ensureInstanceOfRecurringTask(this)
  
  this.setCreationDate()
  await this.setFile()

  this.validate(true, "Cannot insert invalid recurring task");

  await this.app.vault.append(this.file, `\n${this.toMarkdownLine()}`);
  new Notice("Recurring task has been added")
}