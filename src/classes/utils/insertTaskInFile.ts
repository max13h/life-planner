import { Notice } from "obsidian";
import { RecurringTask, ensureInstanceOfRecurringTask } from "../recurringTask/recurringTask";
import Task, { ensureInstanceOfTask } from "../task/task";

export const insertTaskInFile = async (task: Task | RecurringTask): Promise<void> => {
  try {
    const isRecurring = task instanceof RecurringTask;
    const ensureInstance = isRecurring ? ensureInstanceOfRecurringTask : ensureInstanceOfTask;
    ensureInstance(task);
    
    task.setCreationDate();
    await task.setFile();

    task.validate(true, "Cannot insert invalid task");

    await task.app.vault.append(task.file, `\n${task.toMarkdownLine()}`);
    
    if (isRecurring) {
      new Notice("Recurring task has been added");
    } else {
      new Notice("Task has been added");
    }
  } catch (error) {
    new Notice(`Error inserting task: ${error.message}`);
  }
}
