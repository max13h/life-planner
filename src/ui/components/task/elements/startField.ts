import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createField } from "../../createField";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";

type CreateStartFieldProps = {
  app: App;
  container: HTMLElement;
  task: Task;
  allowClick: boolean
}

export const createStartField = ({ app, container, task, allowClick }: CreateStartFieldProps) => {
  const element = createField({
    container,
    config: {
      icon: "▶",
      value: task.start || "-",
    },
    clickAction: {
      allow: allowClick,
      onClick: async () => {
        await updateTaskPropertyModal({ 
          app, 
          task, 
          property: "start", 
          requireOptions: { 
            allow: !!task.schedule,
            message: "The task requires a schedule time"
          }
        })
        element.setText(`▶ ${task.start || "-"}`);
      },
    }
  })
}