import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

type TaskUpdates = Partial<Pick<Task, "status" | "text" | "tags" | "priority" | "schedule" | "start" | "end" | "occurrence" | "projectLink">>;
type RecurringTaskUpdates = Partial<Pick<RecurringTask, "text" | "tags" | "priority" | "projectLink">>;

export const update = <T extends Task | RecurringTask>(
  task: T,
  updates: T extends RecurringTask ? RecurringTaskUpdates : TaskUpdates
): T => {
  const isRecurring = task instanceof RecurringTask;
  const ensureInstance = isRecurring ? ensureInstanceOfRecurringTask : ensureInstanceOfTask;
  ensureInstance(task);

  Object.keys(updates).forEach(key => {
    const update = (updates as any)[key];

    if (task instanceof Task && !isRecurring) {
      if (key === "status") {
        if (task.status === " " && update === "x") task.setCreationDate()
        if (task.status === "x" && update !== "x") task.completed = undefined;

        task.status = update || " ";
        return;
      }
    }

    if (key === "projectLink" && update) {
      if (/^\[\[[^\[\]]+\.md\]\]$/.test(update)) {
        task.projectLink = update;
      } else {
        task.projectLink = `[[${update.replace(/\.md$/, "")}.md]]`;
      }
      return;
    }

    if (key === "tags" && Array.isArray(update)) {
      task.tags = update.map((tag: string) => {
        return tag.startsWith("#") ? tag : "#" + tag
      });
      return;
    }

    (task as any)[key] = update;
  });

  task.validate(true, "Cannot update with invalid task properties");
  return task;
}