import { App } from "obsidian";
import { askSchedule } from "src/classes/task/new/askSchedule";
import Task from "src/classes/task/task";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { createDateField } from "./dateField";

export const createScheduleField = (app: App, task: Task, container: HTMLElement) => {
  const element = createDateField(app, task, container, {
    icon: "📅",
    key: "schedule"
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