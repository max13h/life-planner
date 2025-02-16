import { listenClick } from "src/ui/html";

type FieldConfig = {
  icon?: string;
  value: string;
  style?: string;
  cls?: string;
  size?: "small"
}

type ClickAction = {
  allow: boolean;
  onClick: (e: Event | undefined) => Promise<void> | void
}

type CreateFieldProps = {
  container: HTMLElement;
  clickAction: ClickAction;
  config: FieldConfig;
} 

export const createField = ({ container, config, clickAction}: CreateFieldProps) => {
  const text = config.value

  const element = container.createDiv({
    cls: `element ${config.size ? config.size : "" } ${clickAction && clickAction.allow ? "cursor-pointer" : ""} ${config.cls}`,
    text: `${config.icon ? config.icon + " " : ""}${text || '-'}`,
    attr: {
      style: `
        ${config.style || ""}
      `
    }
  });

  if (clickAction.allow) listenClick(element, clickAction.onClick);

  return element;
}