import { moment } from "obsidian";
import Task from "src/classes/task/task";
import { createField } from "../../createField";

type CreateCreatedFieldProps = {
  task: Task;
  container: HTMLElement;
}

export const createCreatedField = ({ container, task }: CreateCreatedFieldProps) => {
  if (!task.created) return

  const createdDate = moment(task.created);
  const now = moment();
  const daysDifference = createdDate.startOf("day").diff(now.startOf("day"), "days");

  let dateString: string;

  if (daysDifference > 7 || daysDifference < -7) {
    dateString = createdDate.format("YYYY-MM-DD");
  } else if (daysDifference === 0) {
    dateString = "Today";
  } else if (daysDifference > 0) {
    dateString = `In ${createdDate.fromNow(true)}`;
  } else {
    dateString = `${createdDate.fromNow(true)} ago`;
  }

  createField({
    container,
    config: {
      icon: "➕",
      value: dateString,
    },
    clickAction: {
      allow: false,
      onClick: () => undefined
    },
  })
}