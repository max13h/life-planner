import { createStatus } from './firstLine/status/status';
import Task from 'src/classes/task/task';
import { createText } from './firstLine/text';
import { App } from 'obsidian';
import { createDelete } from './firstLine/delete';
import { createSchedule } from './secondLine/schedule';
import { createFirstLine } from './firstLine/createFirstLine';
import { createSecondLine } from './secondLine/createSecondLine';

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
        border-radius: var(--radius-m);
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

  createFirstLine(app, task, taskContainer)
  createSecondLine(app, task, taskContainer)
  


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
