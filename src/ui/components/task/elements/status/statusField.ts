import { statusEvenListeners } from "./eventListeners";
import Task from "src/classes/task/task";
import { setSpan } from "./spanComponent";

type CreateStatusProps = {
  task: Task, 
  container: HTMLElement
}

export const createStatus = ({ task, container }: CreateStatusProps) => {
  const wrapper = container.createDiv({
    attr: {
      style: `
      position: relative; 
      display: inline-block; 
      width: fit-content;
      height: fit-content;
      display: flex;
      align-items: center;
    `
    }
  });

  const checkbox = wrapper.createEl("input", {
    attr: {
      type: "checkbox",
      style: "margin-inline-end: 0",
    },
    value: `${task.status === "x"}`,
  }) as HTMLInputElement;
  checkbox.checked = task.status === "x"

  if (task.status === "-" || task.status === "/") {
    setSpan(wrapper, task.status === "-" ? "❌" : "⚒️")
  }

  statusEvenListeners({ wrapper, task })

  return checkbox;
}