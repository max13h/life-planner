import { App } from "obsidian";
import { createOptionsMenu } from "../elements/menu/optionsMenu";
import { createStatus } from "../elements/status/statusField";
import { createText } from "../elements/textField";
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
  createStatus({ task, container: firstLine })
  createText({ app, task, container: firstLine, allowClick: true })
  createOptionsMenu(app, task, firstLine, refreshView)
}