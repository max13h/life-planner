import { App, Notice } from "obsidian";
import { askStart } from "src/classes/task/new/askStart";
import Task from "src/classes/task/task";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { createDateField } from "./dateField";

export const createStartField = (app: App, task: Task, container: HTMLElement) => {
  const element = createDateField(app, task, container, {
    icon: "▶",
    key: "start",
    requiresSchedule: true
  }, async () => {
    if (!task.schedule) {
      new Notice("Requires a scheduled time");
      return;
    }
    const modal = new NavigationModal(app);
    const modifyStart = await askStart(modal, task, true);
    modal.pages = [modifyStart];
    await modal.open();
    await task.save();
    element.setText(`▶ ${task.start || "-"}`);
  });

  return element;
}