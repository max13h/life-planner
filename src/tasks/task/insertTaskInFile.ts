import Task, { ensureInstanceOfTask } from ".";

export async function insertTaskInFile(this: Task): Promise<void> {
  ensureInstanceOfTask(this)
  
  await this.setCreationDate()
  await this.setFile()

  this.validate(true, "Cannot insert invalid task");

  await this.app.vault.append(this.file, `\n${this.toMarkdownLine()}`);
}