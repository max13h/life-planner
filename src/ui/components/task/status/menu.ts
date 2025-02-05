import { Menu } from "obsidian";
import { ITask } from "types";

export const displayStatusMenu = (e: MouseEvent | TouchEvent, task: ITask) => {
  const menu = new Menu();

  menu.addItem((item) =>
    item
      .setTitle('🔲')
      .onClick(() => {
      })
      .setChecked(task.status === " ")
  );
  menu.addItem((item) =>
    item
      .setTitle('✅')
      .onClick(() => {
      })
      .setChecked(task.status === "x")
  );
  menu.addItem((item) =>
    item
      .setTitle('⚒️')
      .onClick(() => {
      })
      .setChecked(task.status === "/")
  );
  menu.addItem((item) =>
    item
      .setTitle('❌')
      .onClick(() => {
      })
      .setChecked(task.status === "-")
  );

  if (e instanceof MouseEvent) {
    menu.showAtMouseEvent(e);
  } else if (e instanceof TouchEvent) {
    const touch = e.touches[0] || e.changedTouches[0];
    menu.showAtPosition({ x: touch.clientX, y: touch.clientY });
  }
}