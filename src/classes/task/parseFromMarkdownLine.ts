import { TaskParseError } from "errors";
import Task, { ensureInstanceOfTask } from "./task";
import { TaskStatus } from "types";

export function parseFromMarkdownLine(this: Task, line: string): void {
  ensureInstanceOfTask(this)

  const cleanLine = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const columns = cleanLine.split("|").map((col) => col.trim());

  if (columns.length !== 12) {
    throw new TaskParseError("The task line does not have the correct number of columns.");
  }

  try {
    this.status = columns[0] as TaskStatus || " ";
    this.text = columns[1];
    this.schedule = columns[2] || undefined;
    this.start = columns[3] || undefined;
    this.end = columns[4] || undefined;
    this.occurrence = columns[5] || undefined;
    this.projectLink = columns[6] || undefined;
    this.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
    this.priority = columns[8] || undefined;
    this.recurs = columns[9] || undefined;
    this.created = columns[10] || undefined;
    this.completed = columns[11] || undefined;
  } catch (error) {
    throw new TaskParseError(`Failed to parse task line: ${error.message}`);
  }
}