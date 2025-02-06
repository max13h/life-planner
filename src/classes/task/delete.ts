import { TaskParseError } from "errors";
import Task, { ensureInstanceOfTask } from "./task";

export async function deleteTask(this: Task): Promise<void> {
  ensureInstanceOfTask(this);

  if (!this.created) {
    throw new Error("Cannot delete task: no creation date found");
  }
  await this.setFile();

  const fileContent = await this.app.vault.read(this.file);
  const lines = fileContent.split('\n');
  
  const taskLineIndex = lines.findIndex(line => {
    try {
      const tempTask = new Task(this.app);
      tempTask.parseFromMarkdownLine(line);
      return tempTask.created === this.created;
    } catch {
      return false;
    }
  });

  if (taskLineIndex === -1) {
    throw new TaskParseError("Task not found in file");
  }

  // Remove the task line and handle empty lines
  const updatedLines = lines.filter((_, index) => index !== taskLineIndex);

  const updatedContent = updatedLines.join('\n');
  await this.app.vault.modify(this.file, updatedContent);
}