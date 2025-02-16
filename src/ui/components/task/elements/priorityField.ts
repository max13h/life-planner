import Task from "src/classes/task/task";
import { createField } from "../../createField";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";
import { App } from "obsidian";
import { TaskPriorities } from "types";

type CreatePriorityFieldProps = {
  app: App;
  task: Task;
  container: HTMLElement;
}

export const createPriorityField = ({ app, container, task }: CreatePriorityFieldProps) => {
  const element = createField({
    container,
    config: {
      value: convertPriorityInEmoji(task.priority),
    },
    clickAction: {
      allow: true,
      onClick: async () => {
        await updateTaskPropertyModal({
          app,
          task,
          property: "priority",
        })
        element.setText(convertPriorityInEmoji(task.priority));
      }
    },
  })
}

const convertPriorityInEmoji = (priority: TaskPriorities) => {
  return priority === "high" ? "⚫ High" : priority === "low" ? "⚪ Low" : "No priority"
}