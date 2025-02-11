import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createField } from "../../createField";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";

type CreateEndFieldProps = {
  app: App;
  task: Task;
  container: HTMLElement;
  allowClick: boolean;
}

export const createEndField = ({ app, container, task, allowClick }: CreateEndFieldProps) => {
  const element = createField({
    container,
    config: {
      icon: "■",
      value: task.end || "",
    },
    clickAction: {
      allow: allowClick,
      onClick: async () => {
        await updateTaskPropertyModal({
          app,
          task,
          property: "end",
          requireOptions: {
            allow: !!task.schedule && !!task.start,
            message: "Requires a scheduled time & a start time"
          }
        })
        element.setText(`■ ${task.end || "-"}`);
      }
    },
    
  })
}