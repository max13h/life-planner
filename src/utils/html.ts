export const listenKeyEnter = (el: HTMLElement, cb: () => void) => {
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      cb()
    }
  });
}
export const listenKeyUp = (el: HTMLElement, cb: (event?: KeyboardEvent) => void) => {
  el.addEventListener("keyup", (event) => {
    cb(event)
  });
}
export const listenClick = (el: HTMLElement, cb: () => void) => {
  el.addEventListener("click", () => {
    cb()
  });
}
