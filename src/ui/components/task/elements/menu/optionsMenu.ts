import { App, setIcon } from "obsidian";
import Task from "src/classes/task/task";
import { displayOptionsMenu } from "./menu";
import { createField } from "src/ui/components/createField";

export const createOptionsMenu = (app: App, task: Task, container: HTMLElement, refreshView: (() => Promise<void>)) => {
  const optionsMenu = createField({
    container,
    config: {
      value: "",
      style: `
        width: 1rem;
        height: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        padding: 0;
      `
    },
    clickAction: {
      allow: true,
      onClick: async (e) => displayOptionsMenu({ 
        e: e as MouseEvent | TouchEvent, 
        task, 
        app, 
        container, 
        refreshView 
      })
    }
  })
  setIcon(optionsMenu, "ellipsis-vertical");
}