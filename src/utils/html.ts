export const listenKeyEnter = (el: HTMLElement, cb: () => void) => {
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      cb()
    }
  });
}
export const listenKeyUp = (el: HTMLElement, cb: () => void) => {
  el.addEventListener("keyup", () => {
    cb()
  });
}
export const listenClick = (el: HTMLElement, cb: () => void) => {
  el.addEventListener("click", () => {
    cb()
  });
}
