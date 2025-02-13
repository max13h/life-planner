import { setIcon } from "obsidian";
import { listenClick } from "src/ui/html";

interface ButtonOptions {
  text?: string;
  icon?: string;
  style?: string;
  isPrimary?: boolean;
  onClick?: (value: HTMLButtonElement) => void | Promise<void>
}

export const addButtonComponent = (parentEl: HTMLElement, options: ButtonOptions): HTMLButtonElement => {
  const button = parentEl.createEl("button", {
    text: options.text,
    cls: `button ${options.isPrimary ? "primary": ""}`,
    attr: { 
      style: `
        ${options.style}
      ` 
    },
  });
  if (options.icon) setIcon(button, options.icon); 
  listenClick(button, async () => options?.onClick ? await options?.onClick(button) : undefined)
  return button;
}
