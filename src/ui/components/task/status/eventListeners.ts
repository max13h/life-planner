import { displayStatusMenu } from "./menu";
import Task from "src/classes/task/task";

export const statusEvenListeners = (checkbox: HTMLInputElement, task: Task) => {
  let longPressTimer: NodeJS.Timeout;
  let hasLongPressTriggered = false;
  const LONG_PRESS_DURATION = 500;

  // LEFT CLICK OR TOUCH
  checkbox.addEventListener("click", async e => {
    if (task.status === " ") {
      checkbox.checked = true
      checkbox.value = "true"
      await task.update({ 
        status: "x",
      }).save();
    } else if (task.status === "x") {
      checkbox.checked = false
      checkbox.value = "false"
      await task.update({ 
        status: " ",
      }).save();
    }
  })

  // RIGHT CLICK
  checkbox.addEventListener("contextmenu", e => {
    e.preventDefault();
    displayStatusMenu(e, task)
  });


  // MOBILE
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
}