import { App, Menu } from "obsidian";
import { askProject } from "src/classes/task/new/askProject";
import Task from "src/classes/task/task";
import { AlertModal } from "src/ui/modals/alertModal";
import { NavigationModal } from "src/ui/modals/navigationModal";

export const displayOptionsMenu = (e: MouseEvent | TouchEvent, task: Task, app: App, container: HTMLElement, refreshView: (() => Promise<void>)) => {
  const menu = new Menu();

  menu.addItem((item) =>
    item
      .setTitle('Modify project related')
      .onClick(async () => {
        const modal = new NavigationModal(app);
        const modifyProject = await askProject(modal, task, true);
        modal.pages = [modifyProject];
        await modal.open();
        await task.save();
        if (refreshView) await refreshView()
      })
  );

  menu.addItem((item) =>
    item
      .setIcon("app-window")
      .setTitle('Delete')
      .onClick(async () => {
        const modal = new AlertModal(app)
        const answer = await modal.open()

        if (answer) {
          await task.delete()
          container.parentElement?.remove()
        }
      })
  );

  if (e instanceof MouseEvent) {
    menu.showAtMouseEvent(e);
  } else if (e instanceof TouchEvent) {
    const touch = e.touches[0] || e.changedTouches[0];
    menu.showAtPosition({ x: touch.clientX, y: touch.clientY });
  }
}