import { TaskParseError } from "errors";
import { TaskStatus } from "types";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

export const parseFromMarkdownLine = (line: string, taskInstance: Task | RecurringTask): void => {
  if (taskInstance instanceof RecurringTask) {
    ensureInstanceOfRecurringTask(taskInstance);
  } else if (taskInstance instanceof Task) {
    ensureInstanceOfTask(taskInstance);
  } else {
    throw new TaskParseError("Invalid task instance");
  }

  const cleanLine = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const columns = cleanLine.split("|").map((col) => col.trim());

  if (columns.length !== 12) {
    throw new TaskParseError("The task line does not have the correct number of columns.");
  }

  try {
    taskInstance.text = columns[1];
    taskInstance.projectLink = columns[6] || undefined;
    taskInstance.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
    taskInstance.priority = columns[8] || undefined;
    taskInstance.created = columns[10] || undefined;

    if (taskInstance instanceof Task) {
      taskInstance.status = columns[0] as TaskStatus || " ";
      taskInstance.schedule = columns[2] || undefined;
      taskInstance.start = columns[3] || undefined;
      taskInstance.end = columns[4] || undefined;
      taskInstance.occurrence = columns[5] || undefined;
      taskInstance.completed = columns[11] || undefined;
    }
  } catch (error) {
    throw new TaskParseError(`Failed to parse task line: ${error.message}`);
  }
}
