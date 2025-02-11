import { App } from "obsidian";
import Task from "src/classes/task/task";
import { createField } from "../../createField";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";

type CreateScheduleFieldProps = {
  app: App; 
  container: HTMLElement;
  task: Task;
  allowClick: boolean
}

export const createScheduleField = ({ app, container, task, allowClick }: CreateScheduleFieldProps) => {
  const element = createField({
    container,
    config: {
      icon: "📅",
      value: task.schedule || "-",
      style: "text-wrap: nowrap;",
    },
    clickAction: {
      allow: allowClick,
      onClick: async () => {
        await updateTaskPropertyModal({
          app,
          task,
          property: "schedule",
        })
        element.setText(`📅 ${task.schedule || "-"}`);
      },
    }
  })
}