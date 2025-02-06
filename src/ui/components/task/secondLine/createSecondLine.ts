import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createScheduleField, createStartField, createEndField } from "./dateField";

export const createSecondLine = (app: App, task: Task, container: HTMLElement) => {
  const secondLine = container.createDiv({
    attr: {
      style: `
        display: flex;
        gap: 4px;
        align-items: center;
      `
    }
  });

  createScheduleField(app, task, secondLine);
  createStartField(app, task, secondLine);
  createEndField(app, task, secondLine);
}