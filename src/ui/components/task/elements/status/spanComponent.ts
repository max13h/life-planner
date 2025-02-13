export const setSpan = (container: HTMLElement, emoji: string) => {
  container.createSpan({
    text: emoji,
    cls: "emoji"
  });
}