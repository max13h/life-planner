import { Menu } from "obsidian";

export const showMenuAtPointerPosition = ({ e, menu }: { e: MouseEvent | TouchEvent; menu: Menu }) => {
  if (e instanceof MouseEvent) {
    menu.showAtMouseEvent(e);
  } else if (e instanceof TouchEvent) {
    const touch = e.touches[0] || e.changedTouches[0];
    menu.showAtPosition({ x: touch.clientX, y: touch.clientY });
  }
}