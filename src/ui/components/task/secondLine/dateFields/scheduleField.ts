import { App } from "obsidian";
import { askSchedule } from "src/classes/task/new/askSchedule";
import Task from "src/classes/task/task";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { createField } from "../createField";

export const createScheduleField = (app: App, task: Task, container: HTMLElement) => {
  const element = createField(task, container, {
    icon: "📅",
    key: "schedule",
    style: "text-wrap: nowrap;",
  }, async () => {
    const modal = new NavigationModal(app);
    const modifySchedule = await askSchedule(modal, task, true);
    modal.pages = [modifySchedule];
    await modal.open();
    await task.save();
    element.setText(`📅 ${task.schedule || "-"}`);
  });

  return element;
}