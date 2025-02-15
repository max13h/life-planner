import { TaskFileError } from "errors";
import Task from "src/classes/task/task";
import { Tasks } from "src/classes/tasks/tasks";
import { AppWithPlugin } from "types";

export const getTasks = async (app : AppWithPlugin): Promise<Task[]> => {
  const file = await Tasks.getFile(app)
  if (!file) throw new TaskFileError("Task file not found");

  try {
    const fileContent = await app.vault.read(file);
    const lines = fileContent.split("\n");
    const tasksLines = lines.slice(2);
    const tasks: Task[] = [];

    for (const line of tasksLines) {
      if (!line.trim()) continue;

      try {
        const task = new Task(app as AppWithPlugin);
        task.parseFromMarkdownLine(line);

        const validation = task.validate();
        if (validation.isValid) {
          tasks.push(task);
        }
      } catch (error) {
        console.error(`Skipping invalid task line: ${error.message}`);
      }
    }

    return tasks;
  } catch (error) {
    throw new TaskFileError(`Failed to read tasks file: ${error.message}`);
  }
}