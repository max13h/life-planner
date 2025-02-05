import { Menu } from "obsidian";
import Task from "src/classes/task/task";
import { setCancelled, setChecked, setInProgress, setUnchecked } from "./actions";

export const displayStatusMenu = (e: MouseEvent | TouchEvent, task: Task, checkbox: HTMLInputElement) => {
  const menu = new Menu();

  menu.addItem((item) =>
    item
      .setTitle('🔲')
      .onClick(() => {
        setUnchecked(task, checkbox)
      })
      .setChecked(task.status === " ")
  );
  menu.addItem((item) =>
    item
      .setTitle('✅')
      .onClick(() => {
        setChecked(task, checkbox)
      })
      .setChecked(task.status === "x")
  );
  menu.addItem((item) =>
    item
      .setTitle('⚒️')
      .onClick(() => {
        setInProgress(task, checkbox)
      })
      .setChecked(task.status === "/")
  );
  menu.addItem((item) =>
    item
      .setTitle('❌')
      .onClick(() => {
        setCancelled(task, checkbox)
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