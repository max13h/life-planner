import { App, Menu } from "obsidian";
import Task from "src/classes/task/task";
import { updateTaskPropertyModal } from "src/classes/task/updateTaskPropertyModal";
import { AlertModal } from "src/ui/modals/alertModal";
import { showMenuAtPointerPosition } from "src/utils/menus";

type DisplayOptionsMenuProps = {
  e: MouseEvent | TouchEvent; 
  task: Task; 
  app: App; 
  container: HTMLElement; 
  refreshView: (() => Promise<void>);
}

export const displayOptionsMenu = ({ e, task, app, container, refreshView }: DisplayOptionsMenuProps) => {
  const menu = new Menu();

  menu.addItem((item) =>
    item
      .setTitle('Modify project related')
      .onClick(async () => {
        await updateTaskPropertyModal({
          app,
          task,
          property: "projectLink"
        })
        await refreshView()
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

  showMenuAtPointerPosition({ e, menu })
}