import { App } from "obsidian";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";
import Task from "src/classes/task/task";
import { createField } from "../../createField";

type CreateTextProps = {
  app: App, 
  task: Task, 
  container: HTMLElement;
  allowClick: boolean;
}

export const createText = ({ app, task, container, allowClick }: CreateTextProps) => {
  createField({
    container,
    config: {
      value: task.text,
      style: `
        flex: 1;
        border: 0;
        font-size: var(--lp-text-sm);
        padding-top: 4px;
        padding-bottom: 4px;
      `
    },
    clickAction: {
      allow: allowClick,
      onClick: async () => await updateTaskPropertyModal({ app, task, property: "text" })
    }
  })
}