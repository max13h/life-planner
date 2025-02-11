import { Menu } from "obsidian";
import Task from "src/classes/task/task";
import { setCancelled, setChecked, setInProgress, setUnchecked } from "./actions";
import { showMenuAtPointerPosition } from "src/utils/menus";

type DisplayStatusMenuProps = {
  e: MouseEvent | TouchEvent, 
  task: Task, 
  checkbox: HTMLInputElement
}

export const displayStatusMenu = ({ e, task, checkbox }: DisplayStatusMenuProps) => {
  const menu = new Menu();

  const statusOptions = [
    { status: " ", emoji: '🔲', cb: setUnchecked },
    { status: "x" , emoji: "✅", cb: setChecked },
    { status: "/" , emoji: "⚒️", cb: setInProgress },
    { status: "-", emoji: "❌", cb: setCancelled  }
  ]

  statusOptions.forEach(el => {
    menu.addItem((item) =>
      item
        .setTitle(el.emoji)
        .onClick(() => {
          el.cb(task, checkbox)
        })
        .setChecked(task.status === el.status)
    );
  })

  showMenuAtPointerPosition({ e, menu })
}