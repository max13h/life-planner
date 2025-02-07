import { App, TFile } from "obsidian"
import Task from "src/classes/task/task";
import { LifePlannerSettings } from "src/settings/settings"

export type AppWithPlugin = App & {
  plugins: {
    plugins: {
      "life-planner": {
        settings: LifePlannerSettings
      }
    }
  }
};

export type TaskStatus = " " | "/" | "-" | "x";

export interface ITask {
  status: TaskStatus;
  text: string;
  schedule?: string;
  start?: string;
  end?: string;
  occurrence?: string;
  projectLink?: string;
  tags: string[];
  priority?: string;
  recurs?: string;
  created?: string;
  completed?: string;
  app: AppWithPlugin;
  file: TFile;
}

export interface TaskComparators {
  byDate: (a: ITask, b: ITask) => number;
  byPriority: (a: ITask, b: ITask) => number;
  byStatus: (a: ITask, b: ITask) => number;
}

export interface TaskValidationResult {
  isValid: boolean;
  errors: string[];
}

type TaskFilterValue = string | string[] | undefined;
export type TaskFilterProperties = {
  [K in keyof Omit<ITask, 'app' | 'file'>]?: TaskFilterValue;
};

export interface TimeType {
  name: string;
  tag: string;
}

export interface Metadata {
  folderPath: string;
  fileName: string;
  filePathFormatted: string;
}

export interface ProjectViewObject {
  file: TFile;
  tasks: Task[];
  childrenProjects: ProjectViewObject[];
  hasParentProject: boolean;
}