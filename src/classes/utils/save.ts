import { TaskParseError } from "errors";
import { Notice } from "obsidian";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

const validateTaskCreationDate = (task: Task | RecurringTask) => {
  if (!task.created) {
    throw new Error(`Cannot save ${task instanceof RecurringTask ? "recurring task" : "task"}: no creation date found`);
  }
};

const findTaskLineIndex = (lines: string[], task: Task | RecurringTask) => {
  return lines.findIndex(line => {
    try {
      const tempTask = task instanceof RecurringTask ? new RecurringTask(task.app) : new Task(task.app);
      tempTask.parseFromMarkdownLine(line);
      if (task instanceof RecurringTask) return tempTask.created === task.created
      else if (task instanceof Task && tempTask instanceof Task) return tempTask.id === task.id
      else return false
      ;
    } catch {
      return false;
    }
  });
};

export const save = async (task: Task | RecurringTask) => {
  const isRecurring = task instanceof RecurringTask;
  const ensureInstance = isRecurring ? ensureInstanceOfRecurringTask : ensureInstanceOfTask;
  ensureInstance(task);

  validateTaskCreationDate(task);
  await task.setFile();

  const fileContent = await task.app.vault.read(task.file);
  const lines = fileContent.split('\n');

  const taskLineIndex = findTaskLineIndex(lines, task);

  if (taskLineIndex === -1) {
    throw new TaskParseError(`${task instanceof RecurringTask ? "RecurringTask" : "Task"} not found in file`);
  }

  const updatedContent = lines.map((line, index) => 
    index === taskLineIndex ? task.toMarkdownLine() : line
  ).join('\n');

  await task.app.vault.modify(task.file, updatedContent);
  new Notice(`${task instanceof RecurringTask ? "Recurring task" : "Task"} update`);
}
