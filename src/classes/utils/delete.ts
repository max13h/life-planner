import { TaskParseError } from "errors";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

const findTaskLineIndex = (lines: string[], task: Task | RecurringTask): number => {
  return lines.findIndex(line => {
    try {
      const tempTask = new (task instanceof RecurringTask ? RecurringTask : Task)(task.app);
      tempTask.parseFromMarkdownLine(line);
      return tempTask.created === task.created;
    } catch {
      return false;
    }
  });
};

export const deleteTaskOrRecurringTask = async (task: Task | RecurringTask): Promise<void> => {
  if (task instanceof Task) {
    ensureInstanceOfTask(task);
  } else if (task instanceof RecurringTask) {
    ensureInstanceOfRecurringTask(task);
  } else {
    throw new Error("Invalid task type");
  }
  if (!task.created) throw new Error("Cannot delete task: no creation date found")

  await task.setFile();

  const fileContent = await task.app.vault.read(task.file);
  const lines = fileContent.split('\n');
  
  const taskLineIndex = findTaskLineIndex(lines, task);

  if (taskLineIndex === -1) {
    throw new TaskParseError(`${task instanceof RecurringTask ? "RecurringTask" : "Task"} not found in file`);
  }

  const updatedLines = lines.filter((_, index) => index !== taskLineIndex);
  const updatedContent = updatedLines.join('\n');
  await task.app.vault.modify(task.file, updatedContent);
}
