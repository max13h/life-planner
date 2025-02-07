import Task from "src/classes/task/task";
import { listenClick } from "src/ui/html";

interface FieldConfig {
  icon: string;
  key: 'schedule' | 'start' | 'end' | 'other';
  value?: string;
  style?: string;
  requiresSchedule?: boolean;
  requiresStart?: boolean;
}

export const createField = (
  task: Task, 
  container: HTMLElement,
  config: FieldConfig,
  onClick: () => Promise<void>
) => {
  const text = config.key === 'other'
    ? config.value
    : task[config.key]

  const element = container.createDiv({
    text: `${config.icon ? config.icon + " " : ""}${text || '-'}`,
    attr: {
      style: `
        font-size: var(--lp-text-xxs);
        border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.3);
        padding: 2px 8px 2px 8px;
        border-radius: var(--radius-m);
        ${config.style || ""}
      `
    }
  });

  listenClick(element, onClick);

  return element;
}