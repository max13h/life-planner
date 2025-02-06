import { App, Notice } from "obsidian";
import { askEnd } from "src/classes/task/new/askEnd";
import Task from "src/classes/task/task";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { createDateField } from "./dateField";

export const createEndField = (app: App, task: Task, container: HTMLElement) => {
  const element = createDateField(app, task, container, {
    icon: "■",
    key: "end",
    requiresSchedule: true,
    requiresStart: true
  }, async () => {
    if (!task.schedule || !task.start) {
      new Notice("Requires a scheduled time & a start time");
      return;
    }
    const modal = new NavigationModal(app);
    const modifyEnd = await askEnd(modal, task, true);
    modal.pages = [modifyEnd];
    await modal.open();
    await task.save();
    element.setText(`■ ${task.end || "-"}`);
  });

  return element;
}