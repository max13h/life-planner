import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createScheduleField, createStartField, createEndField } from "./dateFields";
import { createTagField } from "./otherFields/tagField";

export const createSecondLine = (app: App, task: Task, container: HTMLElement) => {
  const secondLine = container.createDiv({
    attr: {
      style: `
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: space-between;
      `
    }
  });

  const dateWrapper = secondLine.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      `
    }
  })
  createScheduleField(app, task, dateWrapper);
  createStartField(app, task, dateWrapper);
  createEndField(app, task, dateWrapper);


  const otherWrapper = secondLine.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 4px;
        flex-wrap: wrap;
      `
    }
  })
  createTagField(app, task, otherWrapper);
}