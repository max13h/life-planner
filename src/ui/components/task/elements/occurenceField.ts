import Task from "src/classes/task/task";
import { createField } from "../../createField";
import { Menu } from "obsidian";
import { showMenuAtPointerPosition } from "src/utils/menus";

type CreateOccurenceFieldProps = {
  task: Task;
  container: HTMLElement;
  allowClick: boolean;
  size?: "small";
}

export const createOccurenceField = ({ container, task, size, allowClick }: CreateOccurenceFieldProps) => {
  createField({
    container,
    config: {
      cls: "occurence",
      icon: "",
      value: task.occurrence || "duplicate task",
      size
    },
    clickAction: {
      allow: allowClick,
      onClick: async (e) => {
        const menu = new Menu()

        menu.addItem((item) =>
          item
            .setTitle('Duplicate')
            .onClick(async () => {
              await task.duplicate()
            })
        );
      
        menu.addItem((item) =>
          item
            .setIcon("Remove duplication")
            .setTitle('Delete')
            .onClick(async () => {
            })
        );

        showMenuAtPointerPosition({ menu, e: e as MouseEvent })
      }
    },
  })
}