import { listenKeyUp, listenKeyEnter } from "src/utils/html";

interface InputOptions {
  placeholder?: string;
  style?: string;
  onKeyUp?: (value: string) => void | Promise<void>
  onEnter?: (value: string) => void | Promise<void>
}
export const addInputComponent = (parentEl: HTMLElement, options?: InputOptions): HTMLInputElement => {
  const input = parentEl.createEl("input", { attr: { 
    placeholder: options?.placeholder || "",
    type: "text",
    style: "width: 100%"
  }})
  setTimeout(() => {
    listenKeyUp(input, async () => options?.onKeyUp ? await options?.onKeyUp(input.value) : undefined);
    listenKeyEnter(input, async () => options?.onEnter ? await options?.onEnter(input.value) : undefined)
  }, 1000);

  return input
}


