import { listenKeyUp, listenKeyEnter } from "src/ui/html";

interface InputOptions {
  placeholder?: string;
  style?: string;
  value?: string;
  onKeyUp?: (value: HTMLInputElement) => void | Promise<void>;
  onEnter?: (value: HTMLInputElement) => void | Promise<void>;
}
export const addInputComponent = (parentEl: HTMLElement, options?: InputOptions): HTMLInputElement => {
  const input = parentEl.createEl("input", { attr: { 
    placeholder: options?.placeholder || "",
    type: "text",
    style: "width: 100%",
    value: options?.value || ""
  }})
  setTimeout(() => {
    listenKeyUp(input, async () => options?.onKeyUp ? await options?.onKeyUp(input) : undefined);
    listenKeyEnter(input, async () => options?.onEnter ? await options?.onEnter(input) : undefined)
  }, 500);

  return input
}


