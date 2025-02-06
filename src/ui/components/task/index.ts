import { createStatus } from './firstLine/status/status';
import Task from 'src/classes/task/task';
import { createText } from './firstLine/text/text';
import { App } from 'obsidian';
import { createDelete } from './firstLine/delete/delete';
import { createSchedule } from './secondLine/schedule/schedule';

interface Props {
  onStatusChange?: (newStatus: string) => void;
  onTaskClick?: () => void;
}

export const createTaskComponent = (
  app: App,
  container: HTMLElement,
  task: Task,
  props: Props,
) => {
  const taskContainer = container.createDiv({
    attr: {
      style: `
        display: flex;
        flex-direction: column;
        border-radius: var(--radius-m) 0 0 var(--radius-m);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        cursor: ${props.onTaskClick ? 'pointer' : 'default'};
      `
    }
  });

  if (props.onTaskClick) {
    taskContainer.addEventListener('click', (e) => {
      // Prevent triggering click when interacting with checkbox
      if (!(e.target instanceof HTMLInputElement)) {
        props.onTaskClick?.();
      }
    });
  }

  // Status and Text Container
  const firstLine = taskContainer.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: center;
        gap: 0.5rem;
      `
    }
  });
  createStatus(task, firstLine)
  createText(app, task, firstLine)
  createDelete(app, task, firstLine)

  // Schedule Info Container
  if (task.schedule || task.start || task.end || task.occurrence || task.tags.length) {
    const secondLine = taskContainer.createDiv({
      attr: {
        style: `
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: end;
        `
      }
    });

    if (task.schedule) createSchedule(app, task, secondLine)

    if (task.start) {
      secondLine.createDiv({
        text: `▶️ ${task.start}`,
        attr: {
          style: "font-size: 0.9em;"
        }
      });
    }

    if (task.end) {
      secondLine.createDiv({
        text: `⏹️ ${task.end}`,
        attr: {
          style: "font-size: 0.9em;"
        }
      });
    }
  }

  // Tags Container
  if (task.tags && task.tags.length > 0) {
    const tagsContainer = taskContainer.createDiv({
      attr: {
        style: `
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        `
      }
    });

    task.tags.forEach(tag => {
      tagsContainer.createSpan({
        text: tag,
        attr: {
          style: `
            background: var(--background-modifier-success);
            color: var(--text-on-accent);
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.85em;
          `
        }
      });
    });
  }

  return taskContainer;
};
