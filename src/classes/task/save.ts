import { TaskParseError } from "errors";
import Task, { ensureInstanceOfTask } from "./task";

export async function save(this: Task) {
  ensureInstanceOfTask(this)

  if (!this.created) {
    throw new Error("Cannot save task: no creation date found");
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

  const updatedContent = lines.map((line, index) => 
    index === taskLineIndex ? this.toMarkdownLine() : line
  ).join('\n');
  await this.app.vault.modify(this.file, updatedContent);
}