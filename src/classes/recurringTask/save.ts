import { TaskParseError } from "errors";
import { Notice } from "obsidian";
import { ensureInstanceOfRecurringTask, RecurringTask } from "./recurringTask";

export async function save(this: RecurringTask) {
  ensureInstanceOfRecurringTask(this)

  if (!this.created) {
    throw new Error("Cannot save recurring task: no creation date found");
  }
  await this.setFile();

  const fileContent = await this.app.vault.read(this.file);
  const lines = fileContent.split('\n');
  
  const taskLineIndex = lines.findIndex(line => {
    try {
      const tempRecurringTask = new RecurringTask(this.app);
      tempRecurringTask.parseFromMarkdownLine(line);
      return tempRecurringTask.created === this.created;
    } catch {
      return false;
    }
  });

  if (taskLineIndex === -1) {
    throw new TaskParseError("RecurringTask not found in file");
  }

  const updatedContent = lines.map((line, index) => 
    index === taskLineIndex ? this.toMarkdownLine() : line
  ).join('\n');
  await this.app.vault.modify(this.file, updatedContent);
  new Notice("Recurring task update")
}