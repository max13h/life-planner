import Task, { ensureInstanceOfTask } from "./task";

export async function insertTaskInFile(this: Task): Promise<void> {
  ensureInstanceOfTask(this)
  
  this.setCreationDate()
  await this.setFile()

  this.validate(true, "Cannot insert invalid task");

  await this.app.vault.append(this.file, `\n${this.toMarkdownLine()}`);
}