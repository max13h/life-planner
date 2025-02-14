import { TFile } from "obsidian";
import { AppWithPlugin, Metadata } from "types";
import { TaskFilterProperties } from "types";
import { getFile } from "src/classes/tasks/getFile";
import { getMetadata } from "./getMetadata";
import { getTasks } from "./getTasks";
import Task from "../task/task";
import { getTasksFromProperties } from "./getTasksFromProperties";
import { sortTasks } from "./sortTasks";

export class Tasks {
  static readonly TABLE_HEADER = "|Status|Text|Schedule|Start|End|Occurrence|Project Link|Tags|Priority|Created|Completed|\n|------|-----|--------|-----|---|----------|-------------|----|--------|-------|--------|---------|";

  static async getFile(app: AppWithPlugin): Promise<TFile> { return getFile(app) }

  static async getTasks(app: AppWithPlugin): Promise<Task[]> { return await getTasks(app) }

  static async getMetadata(app: AppWithPlugin): Promise<Metadata> { return getMetadata(app) }

  static async getTasksFromProperties(app: AppWithPlugin, properties: TaskFilterProperties): Promise<Task[]> {
    return await getTasksFromProperties(app, properties)
  }

  static sortTasks(tasks: Task[], ...comparisons: ((a: Task, b: Task) => number)[]): Task[] {
    return sortTasks(tasks, ...comparisons)
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