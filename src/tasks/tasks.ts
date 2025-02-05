import { App } from "obsidian";
import { AppWithPlugin } from "types";
import Task from "./task";
import { TaskFilterProperties } from "types";
import { TaskFileError } from "errors";

export class Tasks {
  static async getAllTasksFromFile(app: App, filePath: string): Promise<Task[]> {
    const file = app.vault.getFileByPath(filePath);
    if (!file) throw new TaskFileError(`Task file not found at path: ${filePath}`);

    try {
      const fileContent = await app.vault.read(file);
      const lines = fileContent.split("\n");
      const tasksLines = lines.slice(2); // Skip header and separator
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

  static retrieveFilePath(app: AppWithPlugin) {
    const settings = app.plugins.plugins["life-planner"].settings;
    const folderPath = settings.tasksFolder.endsWith('/') ? settings.tasksFolder : settings.tasksFolder + '/';
    const fileName = settings.tasksFile.startsWith('/') ? settings.tasksFile.slice(1) : settings.tasksFile;
    const filePathFormatted = folderPath + fileName + ".md";

    return { folderPath, fileName, filePathFormatted };
  }

  static async getTasksFromProperties(app: App, properties: TaskFilterProperties): Promise<Task[]> {
    const tasks = await this.getAllTasksFromFile(
      app,
      this.retrieveFilePath(app as AppWithPlugin).filePathFormatted
    );

    return tasks.filter(task => {
      return Object.entries(properties).every(([key, value]) => {
        const taskValue = task[key as keyof Task];
        
        if (key === 'tags' && Array.isArray(value)) {
          return JSON.stringify(task.tags) === JSON.stringify(value);
        }
        
        return taskValue === value;
      });
    });
  }

  static async getTasksFromDate(app: App, date: string): Promise<Task[]> {
    return this.getTasksFromProperties(app, { schedule: date });
  }

  static sortTasks(tasks: Task[], ...comparisons: ((a: Task, b: Task) => number)[]): Task[] {
    return [...tasks].sort((a, b) => {
      for (const comparison of comparisons) {
        const result = comparison(a, b);
        if (result !== 0) return result;
      }
      return 0;
    });
  }

  static readonly comparisons = {
    byDate: (a: Task, b: Task): number => {
      if (!a.schedule && !b.schedule) return 0;
      if (!a.schedule) return 1;
      if (!b.schedule) return -1;
      return a.schedule.localeCompare(b.schedule);
    },

    byPriority: (a: Task, b: Task): number => {
      const priorityValues: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const aPriority = a.priority && priorityValues[a.priority] !== undefined ? priorityValues[a.priority] : 0;
      const bPriority = b.priority && priorityValues[b.priority] !== undefined ? priorityValues[b.priority] : 0;
      return bPriority - aPriority;
    },

    byStatus: (a: Task, b: Task): number => {
      const statusValues = { "x": 3, "/": 2, "-": 1, " ": 0 };
      return statusValues[a.status] - statusValues[b.status];
    }
  };
}