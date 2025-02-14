import { TaskParseError } from "errors";
import { ensureInstanceOfRecurringTask, RecurringTask } from "./recurringTask";

export async function deleteRecurringTask(this: RecurringTask): Promise<void> {
  ensureInstanceOfRecurringTask(this);

  if (!this.created) {
    throw new Error("Cannot delete task: no creation date found");
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

  // Remove the task line and handle empty lines
  const updatedLines = lines.filter((_, index) => index !== taskLineIndex);

  const updatedContent = updatedLines.join('\n');
  await this.app.vault.modify(this.file, updatedContent);
}