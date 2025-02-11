import { listenClick } from "src/ui/html";

type FieldConfig = {
  icon?: string;
  value: string;
  style?: string;
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
    text: `${config.icon ? config.icon + " " : ""}${text || '-'}`,
    attr: {
      style: `
        font-size: var(--lp-text-xxs);
        border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.3);
        padding: 2px 8px 2px 8px;
        border-radius: var(--radius-m);
        ${clickAction && clickAction.allow ? "cursor: pointer;" : ""}
        ${config.style || ""}
      `
    }
  });

  if (clickAction.allow) listenClick(element, clickAction.onClick);

  return element;
}