import { App, setIcon } from "obsidian";
import Task from "src/classes/task/task";
import { listenClick, listenKeyEnter, listenOverAndOut } from "src/ui/html";
import { AlertModal } from "src/ui/modals/alertModal";

export const createDelete = (app: App, task: Task, container: HTMLElement) => {
  const deleteButton = container.createSpan({
    attr: {
      style: `
        width: 1rem;
        height: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      `
    }
  });
  setIcon(deleteButton, "x");
  listenOverAndOut(deleteButton, () => deleteButton.style.opacity= '0.5', () => deleteButton.style.opacity= '1')
  listenClick(deleteButton, async () => {
    const modal = new AlertModal(app)
    const answer = await modal.open()

    if (answer) {
      await task.delete()
      container.parentElement?.remove()
    }
  });
}