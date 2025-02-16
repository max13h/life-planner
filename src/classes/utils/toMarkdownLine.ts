import { TaskParseError } from "errors";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

export const toMarkdownLine = (taskInstance: Task | RecurringTask): string => {
  if (taskInstance instanceof RecurringTask) {
    ensureInstanceOfRecurringTask(taskInstance);
  } else if (taskInstance instanceof Task) {
    ensureInstanceOfTask(taskInstance);
  } else {
    throw new TaskParseError("Invalid task instance");
  }

  taskInstance.validate(true);
  const tagsString = taskInstance.tags.join(" ");

  if (taskInstance instanceof Task) {
    return `|${taskInstance.status}|${taskInstance.text}|${taskInstance.schedule || ""}|${taskInstance.start || ""}|${taskInstance.end || ""}|${taskInstance.occurrence || ""}|${taskInstance.projectLink || ""}|${tagsString}|${taskInstance.priority || ""}|${taskInstance.created || ""}|${taskInstance.completed || ""}|${taskInstance.id}|`;
  } else {
    return `|${taskInstance.text}|${taskInstance.projectLink || ""}|${tagsString}|${taskInstance.priority || ""}|${taskInstance.created || ""}|`;
  }
}