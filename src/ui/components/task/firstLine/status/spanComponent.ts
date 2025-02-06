export const setSpan = (container: HTMLElement, emoji: string) => {
  container.createSpan({
    text: emoji,
    attr: {
      style: `
        font-size: 0.7rem;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        pointer-events: none;
      `
    }
  });
}