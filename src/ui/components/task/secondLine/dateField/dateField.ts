import { App } from "obsidian";
import Task from "src/classes/task/task";
import { listenClick } from "src/ui/html";

interface DateFieldConfig {
  icon: string;
  key: 'schedule' | 'start' | 'end';
  requiresSchedule?: boolean;
  requiresStart?: boolean;
}

export const createDateField = (
  app: App, 
  task: Task, 
  container: HTMLElement,
  config: DateFieldConfig,
  onClick: () => Promise<void>
) => {
  const element = container.createDiv({
    text: `${config.icon} ${task[config.key] || '-'}`,
    attr: {
      style: `
        font-size: var(--font-smallest);
        border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.3);
        padding: 2px 8px 2px 8px;
        border-radius: var(--radius-m)
      `
    }
  });

  listenClick(element, onClick);

  return element;
}