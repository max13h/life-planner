import { TaskParseError } from "errors";
import { Notice } from "obsidian";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

const ensureTaskInstance = (task: Task | RecurringTask) => {
  if (task instanceof Task) {
    ensureInstanceOfTask(task);
  } else if (task instanceof RecurringTask) {
    ensureInstanceOfRecurringTask(task);
  } else {
    throw new Error("Cannot save: unknown task type");
  }
};

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
      return tempTask.created === task.created;
    } catch {
      return false;
    }
  });
};

export const save = async (task: Task | RecurringTask) => {
  ensureTaskInstance(task);
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
