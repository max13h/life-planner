import Task, { ensureInstanceOfTask } from "./task";

export function toMarkdownLine(this: Task): string {
  ensureInstanceOfTask(this)
  this.validate(true);

  const tagsString = this.tags.join(" ");

  return `|${this.status}|${this.text}|${this.schedule || ""}|${this.start || ""}|${
    this.end || ""}|${this.occurrence || ""}|${this.projectLink || ""}|${tagsString}|${
    this.priority || ""}|${this.created || ""}|${this.completed || ""}|`;
}