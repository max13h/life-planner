import Task from "src/classes/task/task";
import { createField } from "../../createField";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";
import { App } from "obsidian";

type CreatePriorityFieldProps = {
  app: App;
  task: Task;
  container: HTMLElement;
}

export const createPriorityField = ({ app, container, task }: CreatePriorityFieldProps) => {
  const element = createField({
    container,
    config: {
      icon: "",
      value: task.occurrence || "+ priority",
    },
    clickAction: {
      allow: true,
      onClick: async () => {
        await updateTaskPropertyModal({
          app,
          task,
          property: "priority",
        })
        element.setText(`■ ${task.occurrence || "+ priority"}`);
      }
    },
  })
}