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
  if (columns.length !== 11) {
    throw new TaskParseError("The task line does not have the correct number of columns.");
  }

  try {
    if (taskInstance instanceof Task) {
      taskInstance.status = columns[0] as TaskStatus || " ";
      taskInstance.text = columns[1];
      taskInstance.schedule = columns[2] || undefined;
      taskInstance.start = columns[3] || undefined;
      taskInstance.end = columns[4] || undefined;
      taskInstance.occurrence = columns[5] || undefined;
      taskInstance.projectLink = columns[6] || undefined;
      taskInstance.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
      taskInstance.priority = columns[8] || undefined;
      taskInstance.created = columns[9] || undefined;
      taskInstance.completed = columns[10] || undefined;
    } else if (taskInstance instanceof RecurringTask) {
      taskInstance.text = columns[0];
      taskInstance.projectLink = columns[1] || undefined;
      taskInstance.tags = columns[2] ? columns[2].split(" ").filter((tag) => tag.startsWith("#")) : [];
      taskInstance.priority = columns[3] || undefined;
      taskInstance.created = columns[4] || undefined;
    } else throw new Error("Should be an instance of Task or RecurringTask");
    
  } catch (error) {
    throw new TaskParseError(`Failed to parse task line: ${error.message}`);
  }
}
