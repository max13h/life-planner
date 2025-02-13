import { statusEvenListeners } from "./eventListeners";
import Task from "src/classes/task/task";
import { setSpan } from "./spanComponent";

type CreateStatusProps = {
  task: Task, 
  container: HTMLElement
}

export const createStatus = ({ task, container }: CreateStatusProps) => {
  const wrapper = container.createDiv({ cls: "status-wrapper" });

  const checkbox = wrapper.createEl("input", {
    cls: "checkbox",
    attr: { type: "checkbox" },
    value: `${task.status === "x"}`,
  }) as HTMLInputElement;
  checkbox.checked = task.status === "x"

  if (task.status === "-" || task.status === "/") {
    setSpan(wrapper, task.status === "-" ? "❌" : "⚒️")
  }

  statusEvenListeners({ wrapper, task })

  return checkbox;
}