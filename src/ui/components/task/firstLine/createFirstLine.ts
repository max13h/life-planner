import { App } from "obsidian";
import { createOptionsMenu } from "./menu/optionsMenu";
import { createStatus } from "./status/status";
import { createText } from "./text";
import Task from "src/classes/task/task";

export const createFirstLine = (app: App, task: Task, container: HTMLElement, refreshView: (() => Promise<void>)) => {
  const firstLine = container.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: center;
        gap: 0.5rem;
      `
    }
  });
  createStatus(task, firstLine)
  createText(app, task, firstLine)
  createOptionsMenu(app, task, firstLine, refreshView)
}