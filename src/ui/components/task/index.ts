import { createStatus } from './status/status';
import Task from 'src/classes/task/task';

interface Props {
  onStatusChange?: (newStatus: string) => void;
  onTaskClick?: () => void;
}

export const createTaskComponent = (
  container: HTMLElement,
  task: Task,
  props: Props,
) => {
  const taskContainer = container.createDiv({
    attr: {
      style: `
        display: flex;
        flex-direction: column;
        border-radius: var(--radius-l);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        background: var(--background-primary);
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
  const statusTextContainer = taskContainer.createDiv({
    attr: {
      style: `
        display: flex;
        align-items: center;
        gap: 0.5rem;
      `
    }
  });

  createStatus(task, statusTextContainer)

  

  // Task Text
  statusTextContainer.createSpan({
    text: task.text,
    attr: {
      style: `
        flex: 1;
        line-height: 1.5;
      `
    }
  });

  // Schedule Info Container
  if (task.schedule || task.start || task.end) {
    const scheduleContainer = taskContainer.createDiv({
      attr: {
        style: `
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 0.5rem;
          background: var(--background-secondary);
          border-radius: 4px;
        `
      }
    });

    if (task.schedule) {
      scheduleContainer.createDiv({
        text: `📅 ${task.schedule}`,
        attr: {
          style: "font-size: 0.9em;"
        }
      });
    }

    if (task.start) {
      scheduleContainer.createDiv({
        text: `▶️ ${task.start}`,
        attr: {
          style: "font-size: 0.9em;"
        }
      });
    }

    if (task.end) {
      scheduleContainer.createDiv({
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
