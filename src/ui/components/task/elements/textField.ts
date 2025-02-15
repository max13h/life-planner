import { App } from "obsidian";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";
import Task from "src/classes/task/task";
import { createField } from "../../createField";

type CreateTextProps = {
  app: App, 
  task: Task, 
  container: HTMLElement;
  allowClick: boolean;
  style?: string;
}

export const createText = ({ app, task, container, allowClick, style }: CreateTextProps) => {
  const el = createField({
    container,
    config: {
      cls: "text",
      value: task.text,
      style: `${style || ""}`
    },
    clickAction: {
      allow: allowClick,
      onClick: async () => {
        await updateTaskPropertyModal({ app, task, property: "text" })
        el.setText(task.text)
      }
    }
  })
}