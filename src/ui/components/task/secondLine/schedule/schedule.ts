import { App } from "obsidian";
import { askSchedule } from "src/classes/task/new/askSchedule";
import Task from "src/classes/task/task";
import { listenClick } from "src/ui/html";
import { NavigationModal } from "src/ui/modals/navigationModal";

export const createSchedule = (app: App, task: Task, container: HTMLElement) => {
  const schedule = container.createDiv({
    text: `📅 ${task.schedule}`,
    attr: {
      style: `
        font-size: var(--font-smallest);
        border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.3);
        padding: 2px 8px 2px 8px;
        border-radius: var(--radius-m)
      `
    }
  });

  listenClick(schedule, async () => {
    const modal = new NavigationModal(app)

    const modifySchedule = await askSchedule(modal, task, true)
    modal.pages = [
      modifySchedule
    ]

    await modal.open()
  })
}