import { TaskFileError } from "errors";
import { AppWithPlugin } from "types";
import { RecurringTasks } from "./recurringTasks";
import { RecurringTask } from "../recurringTask/recurringTask";

export const getRecurringTasks = async (app : AppWithPlugin): Promise<RecurringTask[]> => {
  const file = await RecurringTasks.getFile(app)
  if (!file) throw new TaskFileError("Task file not found");

  try {
    const fileContent = await app.vault.read(file);
    const lines = fileContent.split("\n");
    const recurringTasksLines = lines.slice(2); // Skip header and separator
    const recurringTasks: RecurringTask[] = [];

    for (const line of recurringTasksLines) {
      if (!line.trim()) continue;

      try {
        const recurringTask = new RecurringTask(app as AppWithPlugin);
        recurringTask.parseFromMarkdownLine(line);

        const validation = recurringTask.validate();
        if (validation.isValid) {
          recurringTasks.push(recurringTask);
        }
      } catch (error) {
        console.error(`Skipping invalid recurringTask line: ${error.message}`);
      }
    }

    return recurringTasks;
  } catch (error) {
    throw new TaskFileError(`Failed to read recurringTasks file: ${error.message}`);
  }
}