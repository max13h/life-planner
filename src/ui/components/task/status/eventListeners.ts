import { onClick } from "./actions";
import { displayStatusMenu } from "./menu";
import Task from "src/classes/task/task";

export const statusEvenListeners = (wrapper: HTMLDivElement, task: Task) => {
  let longPressTimer: NodeJS.Timeout;
  let hasLongPressTriggered = false;
  const LONG_PRESS_DURATION = 500;

  const checkbox = wrapper.querySelector("input");

  if (!checkbox) throw new Error("Unable to retrieve checkbx");
  

  // LEFT CLICK OR TOUCH
  checkbox.addEventListener("click", async () => {
    await onClick(task, checkbox)
  })

  // RIGHT CLICK
  checkbox.addEventListener("contextmenu", e => {
    e.preventDefault();
    displayStatusMenu(e, task, checkbox)
  });


  // MOBILE
  checkbox.addEventListener("touchstart", e => {
    hasLongPressTriggered = false;

    longPressTimer = setTimeout(() => {
      hasLongPressTriggered = true;
      e.preventDefault();
      if (!hasLongPressTriggered) displayStatusMenu(e, task, checkbox);
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