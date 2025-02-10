import { App} from "obsidian";
import Task from "src/classes/task/task";
import { NavigationModal } from "src/ui/modals/navigationModal";
import { createField } from "../createField";
import { askTags } from "src/classes/task/new/askTags";

export const createTagField = (app: App, task: Task, container: HTMLElement) => {
  const tagsWrapper = container.createDiv({
    attr: { 
      style: `
      display: flex;
      align-items: center;
      justify-content: end;
      gap: 4px;
      flex-wrap: wrap;
      font-size: calc(12px + 0.3vw);
      `
    }
  })

  updateUI(app, task, tagsWrapper)

}

const updateUI = (app: App, task: Task, container: HTMLElement) => {
  container.empty()

  if (!task.tags.length) {
    createField(task, container, {
      icon: "",
      key: "other",
      value: "+#",
      requiresSchedule: true,
      requiresStart: true
    }, 
    async () => {
      const modal = new NavigationModal(app);
      const modifyTags = await askTags(modal, task, true);
      modal.pages = [modifyTags];
      const newTags = await modal.open();

      task.update({ tags: newTags })
      await task.save();

      updateUI(app, task, container)
    })
  }

  task.tags.forEach(tag => {
    createField(task, container, {
      icon: "",
      key: "other",
      value: tag,
      requiresSchedule: true,
      requiresStart: true
    }, 
    async () => {
      const modal = new NavigationModal(app);
      const modifyTags = await askTags(modal, task, true);
      modal.pages = [modifyTags];
      const newTags = await modal.open();

      task.update({ tags: newTags })
      await task.save();

      updateUI(app, task, container)
    });
  })
}