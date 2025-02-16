import Task from "src/classes/task/task";
import { createField } from "../../createField";

type CreateOccurenceFieldProps = {
  task: Task;
  container: HTMLElement;
}

export const createOccurenceField = ({ container, task }: CreateOccurenceFieldProps) => {
  createField({
    container,
    config: {
      icon: "",
      value: task.occurrence || "duplicate task",
    },
    clickAction: {
      allow: true,
      onClick: async () => {
        await task.duplicate()
      }
    },
  })
}