import { listenKeyUp, listenKeyEnter } from "src/ui/html";

interface InputOptions {
  placeholder?: string;
  style?: string;
  value?: string;
  focus?: boolean;
  onKeyUp?: (value: HTMLInputElement) => void | Promise<void>;
  onEnter?: (value: HTMLInputElement) => void | Promise<void>;
}
export const addInputComponent = (parentEl: HTMLElement, options?: InputOptions): HTMLInputElement => {
  const input = parentEl.createEl("input", { attr: { 
    placeholder: options?.placeholder || "",
    type: "text",
    value: options?.value || "",
  }});
  
  if (options?.focus) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  setTimeout(() => {
    listenKeyUp(input, async () => options?.onKeyUp ? await options?.onKeyUp(input) : undefined);
    listenKeyEnter(input, async () => options?.onEnter ? await options?.onEnter(input) : undefined);
  }, 500);

  return input;
}


