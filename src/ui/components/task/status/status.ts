import { statusEvenListeners } from "./eventListeners";
import Task from "src/classes/task/task";

export const createStatus = (task: Task, container: HTMLElement) => {
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
    wrapper.createSpan({
      text: task.status === "-" ? "❌" : "⚒️",
      attr: {
        style: `
          font-size: 0.7rem;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          pointer-events: none;
        `
      }
    });
  }

  statusEvenListeners(checkbox, task)

  return checkbox;
}