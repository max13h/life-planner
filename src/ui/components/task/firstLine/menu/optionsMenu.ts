import { App, Menu, setIcon } from "obsidian";
import Task from "src/classes/task/task";
import { listenClick, listenKeyEnter, listenOverAndOut } from "src/ui/html";
import { displayOptionsMenu } from "./menu";

export const createOptionsMenu = (app: App, task: Task, container: HTMLElement, refreshView: (() => Promise<void>)) => {
  const optionsMenu = container.createSpan({
    attr: {
      style: `
        width: 1rem;
        height: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      `
    }
  });
  setIcon(optionsMenu, "ellipsis-vertical");
  listenOverAndOut(optionsMenu, () => optionsMenu.style.opacity= '0.5', () => optionsMenu.style.opacity= '1')
  listenClick(optionsMenu, async (e) => {
    displayOptionsMenu(e, task, app, container, refreshView)
  });
}