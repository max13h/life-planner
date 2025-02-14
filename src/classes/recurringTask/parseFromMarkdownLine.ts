import { TaskParseError } from "errors";
import { ensureInstanceOfRecurringTask, RecurringTask } from "./recurringTask";

export function parseFromMarkdownLine(this: RecurringTask, line: string): void {
  ensureInstanceOfRecurringTask(this)

  const cleanLine = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const columns = cleanLine.split("|").map((col) => col.trim());

  if (columns.length !== 12) {
    throw new TaskParseError("The task line does not have the correct number of columns.");
  }

  try {
    this.text = columns[1];
    this.projectLink = columns[6] || undefined;
    this.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
    this.priority = columns[8] || undefined;
    this.created = columns[10] || undefined;
  } catch (error) {
    throw new TaskParseError(`Failed to parse task line: ${error.message}`);
  }
}