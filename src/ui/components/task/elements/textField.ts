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
  size?: "small"
}

export const createText = ({ app, task, container, allowClick, style, size }: CreateTextProps) => {
  const el = createField({
    container,
    config: {
      cls: "text",
      value: task.text,
      style: `${style || ""}`,
      size
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