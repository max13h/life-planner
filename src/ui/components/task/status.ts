import { Menu } from "obsidian";
import { ITask } from "types";

export const createStatus = (task: ITask, container: HTMLElement) => {
  let checkbox: HTMLElement;
  let longPressTimer: NodeJS.Timeout;
  let hasLongPressTriggered = false;
  const LONG_PRESS_DURATION = 500;

  if (task.status === " " || task.status === "x") {
    checkbox = container.createEl("input", {
      attr: {
        type: "checkbox",
        checked: task.status === "x",
        style: "margin-top: 0.25rem;"
      }
    });
  } else {
    checkbox = container.createDiv({
      attr: {
        style: `
          border: 1px black solid;
          border-radius: var(--checkbox-radius);
          display: flex;
          justify-content: center;
          align-items: center;
          width: var(--checkbox-size);
          height: var(--checkbox-size);
          position: relative;
          overflow: hidden;
        `
      }
    });

    checkbox.createSpan({
      text: task.status === "-" ? "❌" : "⚒️",
      attr: {
        style: `
          font-size: 0.7rem;
          position: absolute;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;
        `
      }
    });
  }

  checkbox.addEventListener("click", e => {
    if (task.status !== " ") {
      
    }
  })

  checkbox.addEventListener("contextmenu", e => {
    e.preventDefault();
    displayStatusMenu(e, task)
  });

  checkbox.addEventListener("touchstart", e => {
    hasLongPressTriggered = false;

    longPressTimer = setTimeout(() => {
      hasLongPressTriggered = true;
      e.preventDefault();
      if (!hasLongPressTriggered) displayStatusMenu(e, task);
    }, LONG_PRESS_DURATION);
  });

  checkbox.addEventListener("touchend", () => {
    clearTimeout(longPressTimer);
    checkbox.style.opacity = "1.0";
  });

  checkbox.addEventListener("touchmove", e => {
    clearTimeout(longPressTimer);
    if (!hasLongPressTriggered) {
      checkbox.style.opacity = "1.0";
    }
  });

  checkbox.addEventListener("touchstart", () => {
    checkbox.style.opacity = "0.7";
  });

  return checkbox;
}

const displayStatusMenu = (e: MouseEvent | TouchEvent, task: ITask) => {
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

