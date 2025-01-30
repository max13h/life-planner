import { setIcon } from "obsidian";

interface ButtonOptions {
  text?: string;
  icon?: string;
  style?: string;
  isPrimary?: boolean
}

export const addButtonComponent = (parentEl: HTMLElement, options: ButtonOptions): HTMLButtonElement => {
  const button = parentEl.createEl("button", {
    text: options.text,
    attr: { style: `width: fit-content; ${options.isPrimary ? "background-color: hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.3);": ""} ${options.style}` },
  });
  if (options.icon) setIcon(button, options.icon); 
  return button;
}
