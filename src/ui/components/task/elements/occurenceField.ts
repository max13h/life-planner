import Task from "src/classes/task/task";
import { createField } from "../../createField";

type CreateOccurenceFieldProps = {
  task: Task;
  container: HTMLElement;
}

export const createOccurenceField = ({ container, task }: CreateOccurenceFieldProps) => {
  if (!task.occurrence) return

  createField({
    container,
    config: {
      icon: "",
      value: task.occurrence,
    },
    clickAction: {
      allow: false,
      onClick: () => undefined
    },
  })
}