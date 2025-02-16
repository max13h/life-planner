import { TaskParseError } from "errors";
import { TaskPriorities, TaskStatus } from "types";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";
import { RecurringTasks } from "../recurringTasks/recurringTasks";
import { Tasks } from "../tasks/tasks";

export const parseFromMarkdownLine = (line: string, task: Task | RecurringTask): void => {
  const isRecurring = task instanceof RecurringTask;
  const ensureInstance = isRecurring ? ensureInstanceOfRecurringTask : ensureInstanceOfTask;
  ensureInstance(task);


  const cleanLine = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const columns = cleanLine.split("|").map((col) => col.trim());
  if (columns.length !== (isRecurring ? RecurringTasks.tableColumns.length : Tasks.tableColumns.length)) {
    throw new TaskParseError("The task line does not have the correct number of columns.");
  }

  try {
    if (task instanceof Task) {
      task.status = columns[0] as TaskStatus || " ";
      task.text = columns[1];
      task.schedule = columns[2] || undefined;
      task.start = columns[3] || undefined;
      task.end = columns[4] || undefined;
      task.occurrence = columns[5] || undefined;
      task.projectLink = columns[6] || undefined;
      task.tags = columns[7] ? columns[7].split(" ").filter((tag) => tag.startsWith("#")) : [];
      task.priority = (columns[8] as TaskPriorities) || undefined;
      task.created = columns[9] || undefined;
      task.completed = columns[10] || undefined;
      task.id = columns[11];
    } else if (task instanceof RecurringTask) {
      task.text = columns[0];
      task.projectLink = columns[1] || undefined;
      task.tags = columns[2] ? columns[2].split(" ").filter((tag) => tag.startsWith("#")) : [];
      task.priority = columns[3] || undefined;
      task.created = columns[4] || undefined;
    } else throw new Error("Should be an instance of Task or RecurringTask");
    
  } catch (error) {
    throw new TaskParseError(`Failed to parse task line: ${error.message}`);
  }
}
