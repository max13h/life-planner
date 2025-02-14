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
  created?: string;
  completed?: string;
  app: AppWithPlugin;
  file: TFile;
}
export interface IRecurringTask extends Omit<ITask, 'status' | 'schedule' | 'start' | 'end' | 'occurrence' | 'completed'> {}

export interface TaskComparators {
  byDate: (a: ITask, b: ITask) => number;
  byPriority: (a: ITask, b: ITask) => number;
  byStatus: (a: ITask, b: ITask) => number;
}

export interface TaskValidationResult {
  isValid: boolean;
  errors: string[];
}

type FilterOperator = {
  type: 'equals' | 'regex' | 'exists' | 'notExists';
  value?: string | string[];
  pattern?: string;
};

// Enhanced filter properties type
export type TaskFilterProperties = {
  [K in keyof Omit<ITask, 'app' | 'file'>]?: string | string[] | FilterOperator;
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

export type PositionedTask = {
  top: number;
  height: number;
  left: number;
  right: number;
  task: Task;
};

export type CalculateTaskPositionsParams = {
  tasks: Task[];
  numberOfPixelForOneMinute: number;
  startingHour: number;
  endingHour: number;
};