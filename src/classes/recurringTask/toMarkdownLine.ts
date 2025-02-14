import { ensureInstanceOfRecurringTask, RecurringTask } from "./recurringTask";

export function toMarkdownLine(this: RecurringTask): string {
  ensureInstanceOfRecurringTask(this)
  this.validate(true);

  const tagsString = this.tags.join(" ");

  return `|${this.text}|${this.projectLink || ""}|${tagsString}|${
    this.priority || ""}|${this.created || ""}|`;
}