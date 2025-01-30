interface InputOptions {
  placeholder?: string;
  style?: string
}
export const addInputComponent = (parentEl: HTMLElement, options?: InputOptions): HTMLInputElement => {
  const button = parentEl.createEl("input", { attr: { 
    placeholder: options?.placeholder || "",
    type: "text",
    style: "width: 100%"
  }})
  return button
}


